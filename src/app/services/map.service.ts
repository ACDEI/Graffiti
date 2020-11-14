import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '@core/services/location.service';
import { switchMap } from 'rxjs/operators';
import { type } from 'os';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = 'mapbox://styles/edugemen/ckg89o0tu6bx619qhhrgeqktm';

  // Coordenadas de la localización donde queremos centrar el mapa
  position: {lng: number, lat:number};
  pitch = 60;
  zoom = 16;

  isOpened = false;

  constructor(private location: LocationService) {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap(lng: number, lat: number) {
    //Comprobamos si tenemos datos en la longitud y latitud, sino se pone por defecto las coordenadas del centro de Málaga
    if(lng == undefined && lat == undefined) {
      lng = -4.425750;
      lat = 36.717827;
    }

    //Inicializamos el mapa
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [lng,lat],
      antialias: true
    });

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
  showPoint(photo) {

      // create the popup
      var popup = new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        '<h1>' + photo.title + '</h1><img src="' + photo.photoURL + '" width=220 heigth=220></img>'
      );

      var el = document.createElement('div');
      el.className = 'marker';
      el.setAttribute('style', "background-image: url(" + photo.photoURL + ")");

      new mapboxgl.Marker(el)
        .setLngLat([photo.g.geopoint.h_, photo.g.geopoint.u_])
        .setPopup(popup)
        .addTo(this.map);
  }

}
