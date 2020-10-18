import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  mapbox = (mapboxgl as typeof mapboxgl);
  map: mapboxgl.Map;
  style = 'mapbox://styles/edugemen/ckg89o0tu6bx619qhhrgeqktm';

  // Coordenadas de la localización donde queremos centrar el mapa
  lat = 36.717827;
  lng = -4.425750;
  pitch = 60;
  zoom = 18;

  geojson: {
    type: 'FeatureCollection',
    features: [{
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-77.032, 38.913]
      },
      properties: {
        title: 'Mapbox',
        description: 'Washington, D.C.'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-122.414, 37.776]
      },
      properties: {
        title: 'Mapbox',
        description: 'San Francisco, California'
      }
    }]
  };

  constructor() {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }
  buildMap() {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat],
      antialias: true
    });
    this.map.addControl(new mapboxgl.NavigationControl());

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
  }

}