import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { LocationService } from './location.service';
import { MapService } from './map.service';
import { firestore } from 'firebase';
import { getJSON } from 'jquery';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { Publication, PublicationI } from '@core/models/publication';
import mapboxgl from 'mapbox-gl';
import { GameService } from './game.service';

export interface SelectedPub {
  pub: PublicationI;
  near: boolean;
}

//------------------------------ Monument ------------------------------
export interface MonumentJSON {
  id:          number;
  name:        string;
  coordinates: Coordinates;
  distancia:   number;
}

export interface Coordinates {
  _latitude:  number;
  _longitude: number;
}

//------------------------------ Publication ------------------------------
export interface PublicationJSON {
  themes: string[]
  title: string
  nLikes: number
  coordinates: Coordinates
  state: string
  g: G
  date: string
  uid: string
  pid: string
  graffiter: string
  photoURL: string
}

export interface Coordinates {
  u_: number
  h_: number
}

export interface G {
  geopoint: Geopoint
  geohash: string
}

export interface Geopoint {
  u_: number
  h_: number
}

const DISTANCIA:number = 10;

@Injectable({
  providedIn: 'root'
})
export class ExplorationService {

  lastUpdatePosition: {lng: number, lat: number};

  position: {lng: number, lat: number};
  posMarker:mapboxgl.Marker = undefined;

  selPub: SelectedPub = undefined;

  markerList:mapboxgl.Marker[] = [];

  markerDictionary:Map<string, mapboxgl.Marker> = new Map<string, mapboxgl.Marker>();

  private dataSource:BehaviorSubject<SelectedPub> = new BehaviorSubject(undefined);
  data:Observable<SelectedPub> = this.dataSource.asObservable();

  constructor(private map: MapService, private location: LocationService, private gameService: GameService, private firestoreDB: AngularFirestore, private componentFactoryResolver: ComponentFactoryResolver) { 
    //this.colleccionFotos = firestore.collection("fotos");

    this.location.getPosition().then(pos => {
      this.lastUpdatePosition = pos;
      this.position = pos;
      //this.position = {lat: 36.71860991, lng: -4.42016};
      this.map.buildMap(this.position.lng, this.position.lat, null);
      this.map.map.setPadding({left: 0, right: 0, top: 400, bottom: 0});
      this.map.map.setPitch(60);

      this.updatePosMarker(this.map.map);

      let self = this;
      
      this.location.watchPosition().subscribe({
        next(pos) {
          if(this.getKilometros(pos) < 0.3) {
            self.lastUpdatePosition = pos;
            self.markerList = [];
            self.cargarMarkers()
          }
          self.position = {lng: pos.coords.longitude, lat: pos.coords.latitude};
          self.updatePosMarker(self.map.map);
          self.map.map.flyTo({center: [pos.coords.longitude, pos.coords.latitude],
            essential: true // this animation is considered essential with respect to prefers-reduced-motion);
          });
        }
      });

      this.cargarMarkers()
      
    });
      

    gameService.data.subscribe( publication => {
      if(publication != undefined){
        this.visitMarker(publication);
      }
      
    })

  }

  cargarMarkers(){
    let self = this;

    getJSON("https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/near/" + this.position.lat + "&" + this.position.lng + "&" + DISTANCIA).then( data => {

      data.forEach( pc => {
        let e:boolean = this.gameService.visitadosDictionary.get(pc.id) != undefined;

        this.firestoreDB.doc("publications/"+pc.id).get().toPromise().then( p => {
          var json:PublicationJSON = <PublicationJSON>p.data();

          let v = {
            pid:json.pid,
            uid:json.uid,
            title:json.title,
            graffiter:json.graffiter,
            photoURL:json.photoURL,
            coordinates:new firestore.GeoPoint(json.g.geopoint.u_,json.g.geopoint.h_),
            date:new Date(),
            state:json.state,
            themes:json.themes
          };

          if(e){
            this.showVisitedMarker(v, false);
          }else{
            var near = pc.distance <= 0.15;
            this.showMarker(v, near);
          }

        });

      })

    });

    getJSON("https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/openData/landmarks/near/" + this.position.lat + "&" + this.position.lng + "&" + DISTANCIA * 1000).then ( data => {

      data.forEach(element => {
        let json:MonumentJSON = element;
        let e:boolean = this.gameService.visitadosDictionary.get(String(json.id)) != undefined;

        let v = {
          pid:String(json.id),
          uid:undefined,
          title:json.name,
          graffiter:undefined,
          photoURL: "assets/logo_aytomalaga.jpg",
          coordinates:new firestore.GeoPoint(json.coordinates._latitude,json.coordinates._longitude),
          date:new Date(),
          state:undefined,
          themes:undefined
        };

        if(e){
          this.showVisitedMarker(v, false);
        }else{
          var near = json.distancia <= 0.15 * 1000;
          this.showMarker(v, near);
        }

      });

    });
  }

  showMarker(pub: PublicationI, near: boolean) {
    var el = document.createElement('div');
    var img = document.createElement('img');
    el.appendChild(img);

    el.className = 'markerNoVisited';
    img.src = pub.photoURL;
    el.addEventListener("click", (event) => {
      this.showModal(pub, near);
    })

    //console.log("Publicacion: " + pub.title + "->",pub);

    let marker = new mapboxgl.Marker(el).setLngLat([pub.coordinates.longitude, pub.coordinates.latitude]).addTo(this.map.map);

    this.markerList.push(marker)

    this.markerDictionary.set(pub.pid, marker);
  }

  showVisitedMarker(pub: PublicationI, near: boolean) {
    var el = document.createElement('div');
    var img = document.createElement('img');
    el.appendChild(img);

    el.className = 'markerVisited';
    img.src = pub.photoURL;
    el.addEventListener("click", (event) => {
      this.showModal(pub, near);
    })

    let marker = new mapboxgl.Marker(el).setLngLat([pub.coordinates.longitude, pub.coordinates.latitude]).addTo(this.map.map);

    this.markerList.push(marker);
  }

  visitMarker(pub: PublicationI){
    var el = this.markerDictionary.get(pub.pid).getElement();

    if(el.classList.contains('markerNoVisited')){
      el.classList.remove('markerNoVisited')
      el.classList.add('markerVisited');
    }

    el.removeEventListener("click", (event) => {
      this.showModal(pub, false);
    });

    el.addEventListener("click", (event) => {
      this.showModal(pub, false);
    })
    
  }

  showModal(pub: Publication, near: boolean) {
    var selpub: SelectedPub = {pub: pub, near: near};
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

  getKilometros(pos:{lat:number,lng:number}) {
    let rad = function(x) {return x*Math.PI/180;}
    var R = 6378.137; //Radio de la tierra en km
    var dLat = rad( this.lastUpdatePosition.lat - pos.lat );
    var dLong = rad( this.lastUpdatePosition.lng - pos.lng );
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(rad(pos.lat)) * Math.cos(rad(this.lastUpdatePosition.lat)) * Math.sin(dLong/2) * Math.sin(dLong/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d.toFixed(3); //Retorna tres decimales
  }

}
