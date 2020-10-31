import { Injectable } from '@angular/core';
import { LocationService } from './location.service';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import { MapService } from './map.service';
import * as firebase from 'firebase/app';
import * as geofirestore from 'geofirestore';
import { LngLat } from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {

  position: {lng: number, lat: number};
  colleccionFotos: AngularFirestoreCollection<any>;

  constructor(private map: MapService, private location: LocationService, private firestore: AngularFirestore) { 
    this.colleccionFotos = firestore.collection("fotos");

    this.location.getPosition().then(pos => {
      this.position = pos;
      this.map.buildMap(this.position.lng, this.position.lat);

      this.map.map.setPitch(60);

      let self = this;

      this.location.watchPosition().subscribe({
        
        next(photo) {
          console.log('Position: ', photo.coords);
          self.map.map.flyTo({center: [photo.coords.longitude, photo.coords.latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion);
          });
        
        }
      });
  
      this.getNearPoints().subscribe({
        next(photo) {
          console.log('Photo: ', photo);
          photo.forEach(function(p) {
            map.showPoint(p);
          });
        }
      });
    })

  }

  getNearPoints() {
    //const center = geo.point(this.position.lng, this.position.lat);
    //const radius = 100;
    //const field = 'position';

    return this.colleccionFotos.valueChanges();
    //return geo.query(this.colleccionFotos).within(center, radius, field);
  }

}
