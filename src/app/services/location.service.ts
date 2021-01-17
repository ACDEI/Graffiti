import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() {}

  getPosition(): Promise<any>
  {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({lng: resp.coords.longitude, lat: resp.coords.latitude});
      },
      err => {
        reject(err);
      });
    });
  }

  watchPosition(): Observable<any> {
    return new Observable((observer) => {
      let watchId: number;

      if ('geolocation' in navigator) {
        watchId = navigator.geolocation.watchPosition((position) => {
          observer.next(position);
        }, (error) => {
          observer.error(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0,
        });
      } else {
        observer.error('Geolocation not available');
      }
      return {
        unsubscribe() {
          navigator.geolocation.clearWatch(watchId);
        }
      };
    });
  }

  // createPoint() {
  //   const position = geo.point(36.594161, -4.535827);
  //   this.colleccionFotos.add({photo_url: "https://4.bp.blogspot.com/_SEi_r6uBgqo/TCKQKAwrQ9I/AAAAAAAAALo/u2SNF6A6j1c/s1600/P1010386.JPG", position})
  // }
}
