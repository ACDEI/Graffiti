import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import { MapService } from './map.service';
import { firestore } from 'firebase';
import * as geofirex from "geofirex";
import * as firebase from 'firebase/app';

const geo = geofirex.init(firebase);

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {

  position: {lng: number, lat: number};
  colleccionFotos: AngularFirestoreCollection<any>;

  constructor(private map: MapService, private location: LocationService, public firestore: AngularFirestore) { 
    this.colleccionFotos = firestore.collection("fotos");

    this.location.getPosition().then(pos => {
      this.position = pos;
      this.map.buildMap(this.position.lng, this.position.lat);

      this.location.watchPosition().subscribe({
        next(photo) {
          console.log('Position: ', photo.coords);
        }
      });
  
      this.getNearPoints().subscribe({
        next(photo) {
          console.log('Photo: ', photo);
        }
      });
    })

  }

  getNearPoints() {
    const center = geo.point(this.position.lng, this.position.lat);
    const radius = 100;
    const field = 'position';

    return this.colleccionFotos.valueChanges();
    //return geo.query(this.colleccionFotos).within(center, radius, field);
  }



}
