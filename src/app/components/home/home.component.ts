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
  //token firebase
  token:string; 

  config: any = {
    itemsPerPage: 12,
    currentPage: 1,
    totalItems: 0
  }

  constructor(private pubService: PublicationsService, private themeService: ThemeService, 
    private route:ActivatedRoute, private fs : AngularFirestore, 
    private http: HttpClient) {}
 
  ngOnInit(): void {
    //obtener por url los token cuando flickr redireccione
    this.oauth_token = this.route.snapshot.queryParams.oauth_token;
    this.oauth_verifier = this.route.snapshot.queryParams.oauth_verifier;
    window.sessionStorage.setItem("oauth_token", JSON.stringify(this.oauth_token));
    window.sessionStorage.setItem("oauth_verifier", JSON.stringify(this.oauth_verifier));
    console.log("vefifier -------> " + this.oauth_verifier);

    this.isFilter = false;
    //this.resetear();
    this.getPublications();
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

  getPublications(){
    this.pubService.getAllPublicationsCF().subscribe(data => {
      this.publicationsList = data;
      this.config.totalItems = this.publicationsList.length;
    })
  }

  pageChanged(event){
    this.config.currentPage = event;
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
