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

  config: any = {
    itemsPerPage: 12,
    currentPage: 1,
    totalItems: 0
  };

  constructor(private userService: UserService, private fs : AngularFirestore, private http: HttpClient) { }

  ngOnInit(): void {
    this.userService.getUserByAdminCF(0).subscribe(data =>{
      this.usersList = data;
      this.config.totalItems = this.usersList.length;
      this.usersList = this.usersList.filter(user => user.uid != JSON.parse(window.sessionStorage.getItem("usuario")).uid);
    })
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

  pageChanged(event){
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
