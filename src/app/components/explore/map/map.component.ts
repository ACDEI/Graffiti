import { Component, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  constructor(private map: MapService) { }

  latitud;

  longitud;


  ngOnInit(): void {
    this.map.buildMap();
    this.map.map.setPitch(50);

    this.map.geojson.features.forEach(function(marker) {

      // create a HTML element for each feature
      var el = document.createElement('div');
      el.className = 'marker';

      // make a marker for each feature and add to the map
      new mapboxgl.Marker(el)
        .setLngLat(marker.geometry.coordinates)
        .addTo(this.map.map);
    });

  }

}
