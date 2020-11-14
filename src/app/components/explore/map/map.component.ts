import { Component, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { LocationService } from '@core/services/location.service'
import * as mapboxgl from 'mapbox-gl';
import { ExplorationService } from '@core/services/exploration.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {

  constructor(private exploration: ExplorationService) { }

  ngOnInit(): void {

  }

}
