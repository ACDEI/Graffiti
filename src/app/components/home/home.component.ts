import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Theme } from '../../models/theme.model';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicationsList: any[];
  themesList: any[];
  twttr: any;

  //Form
  graffiter: string;
  theme: string;
  status: string;

  uid:string;
  isFilter: boolean; 
  //Tokens flickr
  oauth_token:string;
  oauth_verifier:string; 

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
  }

  constructor(private pubService: PublicationsService, private themeService: ThemeService, 
    private route:ActivatedRoute, private fs : AngularFirestore) {}
 
  ngOnInit(): void {
    //obtener por url los token cuando flickr redireccione
    this.oauth_token = this.route.snapshot.queryParams.oauth_token;
    this.oauth_verifier = this.route.snapshot.queryParams.oauth_verifier;
    window.sessionStorage.setItem("oauth_token", JSON.stringify(this.oauth_token));
    window.sessionStorage.setItem("oauth_verifier", JSON.stringify(this.oauth_verifier));
    console.log("vefifier -------> " + this.oauth_verifier);

    this.isFilter = false;
    //this.resetear();
    this.getPublicationsPaginateFirst();
    this.obtenerTematicas();

  }

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
  }

  getByStatus(){
    
  }

  obtenerTematicas(){
    this.themeService.getAllThemes()
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
      this.themesList = data;
    });
  }

  getByTheme(){
    this.pubService.getPublicationsByThemeCF(this.theme).subscribe(value => {
      this.publicationsList = value;
      this.isFilter = true;
    });
  }

  getByGraffiter(){
    this.pubService.getPublicationsByGraffiterCF(this.graffiter).subscribe(value => {
      this.publicationsList = value;
      this.isFilter = true;
    });
  }

  resetear(){
    this.pubService.getAllPublications()
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
      this.publicationsList = data;
      this.isFilter = false
      this.graffiter = "";
    });
  }

  getPublicationsPaginateFirst(){
    this.fs.collection('publications', ref => ref.limit(this.pageSize).orderBy('date', 'desc'))
    .snapshotChanges().subscribe( response => {
      if(!response.length) return;  //No Data
      this.firstInResponse = response[0].payload.doc;
      this.lastInResponse = response[response.length - 1].payload.doc;

      this.publicationsList = [];
      this.publicationsList = response.map(item => {
        return {
          id : item.payload.doc.id,
          data : item.payload.doc.data()
        }
      });

      this.pubService.getPublicationCount().then( value => {
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
    this.fs.collection('publications', 
        ref => ref.limit(this.pageSize).orderBy('date', 'desc')
                  .startAt(this.get_prev_startAt())
                  .endBefore(this.firstInResponse))
      .snapshotChanges().subscribe( response => {
        if(!response.length) return;  //No Data
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.publicationsList = [];
        this.publicationsList = response.map(item => {
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
    this.fs.collection('publications', ref => ref.limit(this.pageSize)
        .orderBy('date', 'desc').startAfter(this.lastInResponse))
      .snapshotChanges().subscribe( response => {
        if(!response.length) return;  //No Data
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        this.publicationsList = [];
        this.publicationsList = response.map(item => {
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

}
