import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  private path: string = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/openWeatherMap/weather';

  constructor(private http: HttpClient, private auth: AuthService) { }

  async getWeather() {
    let httpOpt = await this.auth.getHeader();
    var res: any;
    await this.http.get<any>(this.path, httpOpt).toPromise().then(u => {
      res = u;
    }).catch(u => {
      res = null;
    });
    return new Promise<any>((resolve, reject) => {
      resolve(res);
    })
  }

}
