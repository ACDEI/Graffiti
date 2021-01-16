import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private path: string = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/openWeatherMap/weather';

  constructor(private http: HttpClient) { }

  async getWeather() {
    var res: any;
    await this.http.get<any>(this.path).toPromise().then(u => {
      res = u;
    });
    return new Promise<any>((resolve, reject) => {
      resolve(res);
    })
  }

}
