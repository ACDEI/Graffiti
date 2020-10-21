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
  lat = 36.717827;
  lng = -4.425750;
  position: {lng: number, lat:number};
  pitch = 60;
  zoom = 18;

  isOpened = false;

  constructor(private location: LocationService) {
    // Asignamos el token desde las variables de entorno
    this.mapbox.accessToken = environment.mapBoxToken;
  }

  buildMap() 
  {
    //Inicializamos la posición en Málaga
    this.position = {lng: this.lng, lat: this.lat};

    //Inicializamos le mapa
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng,this.lat],
      antialias: true
    });

    //Calculamos la posición del usuario y volamos hasta ella
    this.location.getPosition().then(pos => {
      this.position = pos;

      //Vuela hasta la ubicación actual
      this.map.flyTo({center: [this.position.lng,this.position.lat], essential: true});

      this.isOpened = true;
    })

    //Calculamos los puntos cercanos
    // this.location.getNearPoints().subscribe({
    //   next(photo) {
    //     console.log('Photo: ', photo);
    //   }
    // });

    this.location.watchPosition((lng: number, lat: number) => {
      if(this.map != undefined && this.isOpened){
        this.position = {lng, lat};
        this.map.setCenter(this.position);
        // this.location.getNearPoints(currPos.lng, currPos.lat).subscribe({
        //   next(photo) {
        //     console.log('Current Position: ', photo);
        //   }
        // });
      }
    })

    this.location.getNearPoints(this.position.lng, this.position.lat).subscribe({
      next(photo){
        console.log('Current Position: ', photo);
      }
    })









    /*
    this.location.watchPosition().then(pos => {
      if(pos) {
        this.lat = pos.lat;
        this.lng = pos.lng;

        this.map = new mapboxgl.Map({
          container: 'map',
          style: this.style,
          zoom: this.zoom,
          center: [this.lng, this.lat],
          antialias: true
        });
        this.map.addControl(new mapboxgl.NavigationControl());

        this.location.getNearPoints().subscribe({
          next(photo) {
            console.log('Current Position: ', photo);
          }
        });
      }else{
        console.log(pos);
      }
      
      
    })

    */
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
