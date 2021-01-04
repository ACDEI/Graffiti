import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '@core/services/location.service';
import { switchMap } from 'rxjs/operators';
import { type } from 'os';
import { Publication } from '@core/models/publication';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = 'mapbox://styles/edugemen/ckg89o0tu6bx619qhhrgeqktm';

  // Coordenadas de la localización donde queremos centrar el mapa
  position: {lng: number, lat:number};
  pitch = 90;
  zoom = 18;

  isOpened = false;

  constructor(private location: LocationService) {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap(lng: number, lat: number, interact: boolean) {
    //Comprobamos si tenemos datos en la longitud y latitud, sino se pone por defecto las coordenadas del centro de Málaga
    if(lng == undefined && lat == undefined) {
      lng = -4.425750;
      lat = 36.717827;
    }

    if(interact){
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        center: [lng,lat],
        antialias: true,
      });
    }else{
      this.map = new mapboxgl.Map({
        container: 'map',
        style: this.style,
        zoom: this.zoom,
        center: [lng,lat],
        antialias: true,
        maxZoom: 19,
        minZoom: 18,
        dragPan: false,
      });
    }

    //Inicializamos el mapa
    

  }

  setOnClick() {
    let self = this;

    let aux:mapboxgl.Marker;

    this.map.on("click", function (e) {

      console.log(e);

      if(aux != undefined){
        aux.remove();
      }

      aux = new mapboxgl.Marker()
        .setLngLat(e.lngLat)
        .addTo(self.map);
      });
  }

  // make a marker for each feature and add to the map
  showPoint(p:Publication) {

    //var p = new Publication(photo.pid,photo.uid,photo.title,photo.graffiter,photo.photoURL,photo.g.geopoint,new Date(),photo.state, photo.themes);

      // create the popup
      var popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        '<app-expl-modal></app-expl-modal>'
      );

      var el = document.createElement('div');
      el.className = 'marker';
      el.addEventListener("click", (event) => {
        document.createElement("<app-expl-modal></app-expl-modal>")
      })

      new mapboxgl.Marker(el)
        .setLngLat([p.coordinates.longitude, p.coordinates.latitude])
        .addTo(this.map)
  }

}
