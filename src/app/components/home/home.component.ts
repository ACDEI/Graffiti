import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Theme } from '../../models/theme.model';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScrollPaginationPublicationsService } from '@core/services/scroll-pagination-publications.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stateList : string[] = ['Perfect', 'Legible', 'Illegible', 'Deteriorated'];
  themesList: any[];
  pubsPerPage = 12;
  isFilter: boolean; 
  loadAll: boolean;

  config: any = {
    itemsPerPage: this.pubsPerPage,
    currentPage: 1,
    totalItems: 0
  }

  //Form
  graffiter: string;
  theme: string;
  status: string;
  title: string;

  uid:string;
  //Tokens flickr
  oauth_token:string;
  oauth_verifier:string; 
  //token firebase
  token:string; 

  constructor(private themeService: ThemeService, private route:ActivatedRoute, 
    private http: HttpClient, public page : ScrollPaginationPublicationsService, 
    private ts : ToastrService) {}
 
  ngOnInit(): void {
    //obtener por url los token cuando flickr redireccione
    this.oauth_token = this.route.snapshot.queryParams.oauth_token;
    this.oauth_verifier = this.route.snapshot.queryParams.oauth_verifier;
    window.sessionStorage.setItem("oauth_token", JSON.stringify(this.oauth_token));
    window.sessionStorage.setItem("oauth_verifier", JSON.stringify(this.oauth_verifier));
    console.log("vefifier -------> " + this.oauth_verifier);

    this.resetAll();

    this.getPublications();
    this.obtenerTematicas();

  }

  resetAll(){
    this.graffiter = '';
    this.status = '';
    this.theme = '';
    this.title = '';
    this.isFilter = false;
    this.loadAll = false;
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

  onChange(event?){

    if(this.theme.trim() === '' && this.status.trim() === ''
        && this.title.trim() === '' && this.graffiter.trim() === '') this.getPublications();
    else {
      let opts : any = {
        limit : this.pubsPerPage,
        prepend : false,
        reverse : false
      }
      if(this.theme != null && this.theme !== '') opts = { ...opts, themes : [this.theme]}
      if(this.status != null && this.status !== '') opts = { ...opts, state : this.status}
      if(this.title != null && this.title !== '') opts = { ...opts, title : this.title}
      if(this.graffiter != null && this.graffiter !== '') opts = { ...opts, graffiter : this.graffiter}
      this.page.reset();
      this.page.init('publications', 'date', {...opts});
      this.isFilter = true;
      this.loadAll = false;
    }
  }

  getPublications(){
    this.theme = "";
    this.status = '';
    let opts : any = {
      limit : this.pubsPerPage,
      prepend : false,
      reverse : false
    }
    this.isFilter = false;
    this.loadAll = false;
    this.page.reset();
    this.page.init('publications', 'date', {...opts})
  }

  loadMore(){
    var prev : any, post : any;
    this.page.data.subscribe(l => { prev = l.length; });
    this.page.more();
    this.page.data.subscribe(l => { post = l.length; });
    if(prev == post) {
      this.loadAll = true;
      this.ts.info('Parece que no hay más que ver... ¡Anímate a subir algo!', '', {timeOut: 1000}); 
    }
  }

  clear(n : number) {
    if(n == 1) this.title = '';
    if(n == 2) this.graffiter = '';
    if(n == 3) this.theme = '';
    if(n == 4) this.status = '';

    if(this.title === '' && this.graffiter === '' 
        && this.theme === '' && this.status === '') this.getPublications()
    else this.onChange();
  }

  async getQualityAir(){
    
    let self = this; 
    await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      // Send token to your backend via HTTPS
      // ...
      self.token = idToken; 
      //console.log(idToken);
    }).catch(function(error) {
      // Handle error
    });


     console.log(this.token);

     const headers = new HttpHeaders({'Authorization': 'Bearer ' + this.token });

     let result = this.http.get<any>("http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/openData/airQuality/",{headers});

     result.subscribe(data => {
       console.log(data);
     })

  }


}
