import { ComponentFactoryResolver, ComponentRef, Injectable, ReflectiveInjector, ViewContainerRef } from '@angular/core';
import { LocationService } from './location.service';
//import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import { MapService } from './map.service';
import * as firebase from 'firebase/app';
import * as geofirestore from 'geofirestore';
import { GeolocateControl, LngLat } from 'mapbox-gl';
import { getJSON } from 'jquery';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { deflate } from 'zlib';
import { Publication } from '@core/models/publication';
import mapboxgl from 'mapbox-gl';

export interface SelectedPub {
  pub: Publication;
  near: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {

  position: {lng: number, lat: number};
  posMarker:mapboxgl.Marker = undefined;

  selPub: SelectedPub = undefined;

  private dataSource:BehaviorSubject<SelectedPub> = new BehaviorSubject(undefined);
  data:Observable<SelectedPub> = this.dataSource.asObservable();

  constructor(private map: MapService, private location: LocationService, private firestore: AngularFirestore, private componentFactoryResolver: ComponentFactoryResolver) { 
    //this.colleccionFotos = firestore.collection("fotos");

    this.location.getPosition().then(pos => {
      this.position = pos;
      this.map.buildMap(this.position.lng, this.position.lat, false);
      this.map.map.setPadding({left: 0, right: 0, top: 400, bottom: 0});
      this.map.map.setPitch(60);

      this.updatePosMarker(this.map.map);

      let self = this;

      this.location.watchPosition().subscribe({
        next(pos) {
          self.position = {lng: pos.coords.longitude, lat: pos.coords.latitude};
          self.updatePosMarker(self.map.map);
          self.map.map.flyTo({center: [pos.coords.longitude, pos.coords.latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion);
          });
        }
      });
  
      getJSON("https://us-central1-graffiti-9b570.cloudfunctions.net/APIRest/near/" + this.position.lat + "&" + this.position.lng + "&" + 10).then( data => {

        data.forEach( pc => {
          this.firestore.doc("publications/"+pc.id).get().toPromise().then( p => {
            //console.log(p.data())
            var pub = new Publication(p.data().pid,p.data().uid,p.data().title,p.data().graffiter,p.data().photoURL,p.data().g.geopoint,new Date(),p.data().state, p.data().themes, p.data().nLikes);
            //var near = pc.distance <= 0.04;
            console.log(pc.distance);
            var near = pc.distance <= 0.15;
            //map.showPoint(p.data());
            this.showMarker(map.map, pub, near);
          })
        })

      });

      this.selPub
      

      /*
      this.getNearPoints().subscribe({
        next(photo) {
          console.log('Photo: ', photo);
          photo.forEach(function(p) {
            map.showPoint(p);
          });
        }
      });
      */
    })

  }

  near(pos: {lng: number, lat: number}, lng: number, lat: number):boolean {
    let alpha:number = 0.00016;

    return Math.abs(pos.lng - lng) + Math.abs(pos.lat - lat) <= alpha;
  }

  showMarker(m: mapboxgl.Map, pub: Publication, near: boolean) {

    var el = document.createElement('div');
    el.className = 'marker';
    el.style.backgroundImage = "url(" + pub.photoURL + ")";
    el.addEventListener("click", (event) => {
      this.showModal(pub, near);
    })

    new mapboxgl.Marker(el)
      .setLngLat([pub.coordinates.longitude, pub.coordinates.latitude])
      .addTo(m)

  }

  showModal(pub: Publication, near: boolean) {
    var selpub: SelectedPub = {pub: pub, near: near};
    console.log("Lado servicio: " + selpub);
    this.dataSource.next(selpub);
  }

  updatePosMarker(m: mapboxgl.Map) {
    if(this.posMarker != undefined) {
      this.posMarker.remove();
    }

    var el = document.createElement('div');
    el.className = 'markerUser';

    this.posMarker = new mapboxgl.Marker(el)
      .setLngLat([this.position.lng, this.position.lat])
      .addTo(m);
  }



}
