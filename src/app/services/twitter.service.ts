import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private api = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/twitter/updateStatus/';
  //private apiLocal = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/twitter/updateStatus/";
  constructor(private http : HttpClient, private auth: AuthService) { }


  async sendTweet(tweet : string,url : string,lat : number,long :number){
    let httpOpt = await this.auth.getHeader();
    var data = JSON.parse(window.sessionStorage.getItem('usuario'));
    var uid = data.uid;
    //console.log(tweet);
    //console.log(this.api+uid);
    let status = {"status" : tweet+ " "+url,
     "lat" : lat ,"long" : long, "display_coordinates" : true,"geo_enabled" : true}
    await this.http.post(this.api + uid, status, httpOpt).subscribe(result => {
      //console.log(result)
  });
    

  }
}
