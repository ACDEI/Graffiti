import { Injectable, Query } from '@angular/core';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import * as firebase from 'firebase/app';
import * as geofirex from "geofirex";
import { firestore } from 'firebase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AngularFireModule } from '@angular/fire';
import { LngLatLike } from 'mapbox-gl';
import { MapService } from './map.service';

const geo = geofirex.init(firebase);

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
          timeout: 5000,
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
