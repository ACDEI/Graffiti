import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private api = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/twitter/updateStatus/';
  //private apiLocal = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/twitter/updateStatus/";
  constructor(private http : HttpClient, private auth: AuthService, private ts: ToastrService) { }


  async sendTweet(tweet: string, url: string, lat: number,long: number){

    var user = JSON.parse(window.sessionStorage.getItem('usuario'));
    if(!this.auth.isTwitterConnected || 
      (user.accessToken == null || user.tokenSecret == null)) {
        await this.auth.conectarTwitter().then(success => {
          this.uploadTweet(user, tweet, url, lat, long);
        }).catch(err => {
          return;
        });
    } else this.uploadTweet(user, tweet, url, lat, long);
  }

  async uploadTweet(user: any, tweet: string, url: string, lat: number, long: number) {
    
    let httpOpt = await this.auth.getHeader();
    var uid = user.uid;

    let status = {"status" : tweet + " " + url,
     "lat": lat, "long": long, "display_coordinates": true,"geo_enabled": true}
    await this.http.post(this.api + uid, status, httpOpt).subscribe(result => {
      this.ts.success('Revisa tu timeline', 'Tweet Compartido', {timeOut: 1500});
    }, 
    err => {
      this.ts.error('Parece que ha habido un error. Revisa que estés vinculado a ' 
      + ' Twitter.\nO quizás ya has compartido esta foto...', 'Vaya...', {timeOut: 2000});
    });
  }
}
