import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  private api = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/twitter/updateStatus/';
  //private apiLocal = "http://localhost:5001/graffiti-9b570/us-central1/MalagArtApiWeb/twitter/updateStatus/";
  constructor(private http : HttpClient) { }


  async sendTweet(tweet : string,url : string,lat : number,long :number){

    var data =JSON.parse(window.sessionStorage.getItem('usuario'));
    var uid = data.uid;
    console.log(tweet);
    console.log(this.api+uid);
    let status = {"status" : tweet+ " "+url,
     "lat" : lat ,"long" : long, "display_coordinates" : true,"geo_enabled" : true}
    await this.http.post(this.api+uid,status).subscribe(result => {
      console.log(result)
  });
    

  }
}
