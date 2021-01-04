import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '@core/services/classes_services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {

  usersList: any[];
  isFilter: boolean;
  twttr: any;

  //Forms
  fullName: string;
  email: string;
  nickName: string;

  // Para paginacion:
  firstInResponse : any = [];  //First Document Retrieved
  lastInResponse : any = [];  //Last Document Retrieved
  prev_start_at : any = [];  //Documents of Previous Pages
  pageSize = 8;  //Items Per Page
  totalItems : any;

  config: any = {
    itemsPerPage: this.pageSize,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private userService: UserService, private fs : AngularFirestore, private http: HttpClient) { }

  ngOnInit(): void {
    this.getUsersPaginateFirst();
    this.isFilter = false;
  }

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
  }

  getByFullName() {
    this.userService.getUsersByNameCF(this.fullName).subscribe(values => {
      this.usersList = values;
      this.isFilter = true;
    });
  }

  getByEmail() {
    this.userService.getUserByEmailCF(this.email).subscribe(values => {
      this.usersList = values;
      this.isFilter = true;
    });
  }

  getByNickName() {
    
  }

  getUsersPaginateFirst(){
    this.fs.collection('users', ref => ref.limit(this.pageSize).orderBy('fullName', 'asc'))
    .snapshotChanges().subscribe( response => {
      if(!response.length) return;  //No Data
      this.firstInResponse = response[0].payload.doc;
      this.lastInResponse = response[response.length - 1].payload.doc;

      this.usersList = [];
      this.usersList = response.map(item => {
        return {
          id : item.payload.doc.id,
          data : item.payload.doc.data()
        }
      });

      this.userService.getUsersCount().then( value => {
        this.config.totalItems = value;
        console.log(this.totalItems)
      })

      //Initialize Values
      this.prev_start_at = [];
      //this.pag_clicked_count = 0;
      this.config.totalItems = this.totalItems;

      //Push First Item to Use for Previous Action
      this.prev_start_at.push(this.firstInResponse);
    });
  }

  prevPage() {
    this.fs.collection('users', 
        ref => ref.limit(this.pageSize).orderBy('fullName', 'asc')
                  .startAt(this.get_prev_startAt())
                  .endBefore(this.firstInResponse))
      .snapshotChanges().subscribe( response => {
        if(!response.length) return;  //No Data
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.usersList = [];
        this.usersList = response.map(item => {
          return {
            id : item.payload.doc.id,
            data : item.payload.doc.data()
          }
        });

        //Push First Item to Use for Previous Action
        this.prev_start_at.forEach(element => {
          if (this.firstInResponse.data().id == element.data().id) element = null;
        });
      });
  }

  nextPage() {
    this.fs.collection('users', ref => ref.limit(this.pageSize)
        .orderBy('fullName', 'asc').startAfter(this.lastInResponse))
      .snapshotChanges().subscribe( response => {
        if(!response.length) return;  //No Data
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.usersList = [];
        this.usersList = response.map(item => {
          return {
            id : item.payload.doc.id,
            data : item.payload.doc.data()
          }
        });

        //Push First Item to Use for Previous Action
        this.prev_start_at.push(this.firstInResponse);
      });
  }

  //Return the Doc rem where previous page will startAt
  get_prev_startAt() {
    if (this.prev_start_at.length > (this.config.currentPage))
      this.prev_start_at.splice(this.prev_start_at.length - 2, this.prev_start_at.length - 1);
    return this.prev_start_at[this.config.currentPage];
  }

  pageChanged(event){
    var pageC = this.config.currentPage;
    if(event > pageC) this.nextPage();
    else this.prevPage();
    this.config.currentPage = event;
  }

  resetear(){
    this.userService.get_AllUsers()
    .snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }))
      )
    )
    .subscribe((data) => {
      this.usersList = data;
      this.isFilter = false
      this.fullName = "";
      this.email = "";
      this.nickName = "";
    });
  }

}
