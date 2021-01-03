import { Component, OnInit } from '@angular/core';
import { MapService } from '@core/services/map.service';
import { LocationService } from '@core/services/location.service'
import * as mapboxgl from 'mapbox-gl';
import { ExplorationService } from '@core/services/exploration.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  
  uid:string;

  constructor(private exploration: ExplorationService, private authS: AuthService) { }

  ngOnInit(): void {
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));
    this.uid = usuario.uid;
  }

  cerrarSesion(){
    this.uid = "";
    this.authS.userSelected = null; 
    this.authS.signOut();
  }

}
