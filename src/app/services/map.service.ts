import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';
import { LocationService } from '@core/services/location.service';
import { switchMap } from 'rxjs/operators';

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

    // // add markers to map
    // this.geojson.features.forEach(function(marker) {

    //   // create a HTML element for each feature
    //   var el = document.createElement('div');
    //   el.className = 'marker';

    //   // make a marker for each feature and add to the map
    //   new mapboxgl.Marker(el)
    //     .setLngLat(marker.geometry.coordinates)
    //     .addTo(this.map);
    // });
  //}

}
