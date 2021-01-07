import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AuthService } from './auth.service';
import { PublicationsService } from './classes_services/publications.service';

@Injectable({
  providedIn: 'root'
})
export class FlickrService {

  //OAuth
  tokenFirebase : string;
  flickr_oauth_token : string;
  flickr_oauth_token_secret : string;

  constructor(private http: HttpClient, private auth: AuthService, 
      private ps : PublicationsService) {
    //this.oauthUser();
  }

  private flickUrl = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/flickr/";

  conectarFlickr(url) {
    let self = this;

    if(this.tokenFirebase == null) this.oauthUser();
    const httpOpt = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.tokenFirebase }),
      params: new HttpParams().set('url', url)
    }
    this.http.get<any>(this.flickUrl + 'conectar', httpOpt).toPromise().then( data => {
      console.log('dataURL: ' + data.url, 'tsecret', + data.token_secret);
      self.flickr_oauth_token_secret = data.token_secret;
      ///Si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      window.location.href = data.url; 
    });
  }

  async subirFlickr(formData, photo) {
    console.log("tsecret", this.flickr_oauth_token_secret);

    if(this.tokenFirebase == null) this.oauthUser();
    const httpOpt = {
      headers: new HttpHeaders({'Authorization': 'Bearer ' + this.tokenFirebase })
    }

    //console.log('ABC: ' + photo);
    let result = await this.http.post<any>(this.flickUrl + 'upload', formData, httpOpt);

    await result.toPromise().then(data =>{
      //self.idFoto = data.id ;
      //console.log(data);
      let urlFoto = "https://live.staticflickr.com/"+ data.photo.server + "/"+ data.photo.id +"_"+ data.photo.secret +".jpg" ;
      //console.log(urlFoto);

      photo = { ...photo, 'photoURL' : urlFoto};
      //console.log('p: ' + JSON.stringify(photo));

      //HASTA QUE SUBAMOS LAS FUNCTIONS, ASI FUNCIONA
      this.http.post<any>("http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/publications", photo, httpOpt).subscribe();

      //this.ps.postPublicationCF(photo).subscribe();
    })


  }

  //Autenticar Usuario
  async oauthUser(){
    let tokenFb : string;
    await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
      // Send token to your backend via HTTPS
      tokenFb = idToken;
      //console.log(idToken);
    }).catch(function(error) {
      // Handle error
    });
    this.tokenFirebase = tokenFb;
    return tokenFb;
  }

}
