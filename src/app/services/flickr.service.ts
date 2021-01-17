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
  flickr_oauth_verifier: string;
  flickr_oauth_token : string;
  flickr_oauth_token_secret : string;

  constructor(private http: HttpClient, private auth: AuthService, 
      private ps : PublicationsService) {
  }

  private flickUrl = "https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/flickr/";

  async conectarFlickr(url) {

    let httpOpt = await this.auth.getHeader();
    httpOpt['params'] = new HttpParams().set('url', url)

    this.http.get<any>(this.flickUrl + 'conectar', httpOpt).subscribe( data => {
      //console.log('dataURL: ' + data.url, 'tsecret', data.token_secret);
      //self.flickr_oauth_token_secret = data.token_secret;
      window.sessionStorage.setItem("flickr_oauth_token_secret", JSON.stringify(data.token_secret));
      ///Si el usuario acepta flickr devolverá un callback a la home del usuario en malagart
      window.location.href = data.url;
    })
    
  }

  async subirFlickr(formData, photo) {
    //console.log("tsecret", this.flickr_oauth_token_secret);

    const httpOpt = await this.auth.getHeader();
    let result = await this.http.post<any>(this.flickUrl + 'upload', formData, httpOpt);

    result.subscribe( data => {
      let urlFoto = "https://live.staticflickr.com/"+ data.photo.server + "/"+ data.photo.id +"_"+ data.photo.secret +".jpg" ;
      photo = { ...photo, 'photoURL' : urlFoto};
      this.http.post<any>("https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/publications", photo, httpOpt).subscribe();
    })

  }

}
