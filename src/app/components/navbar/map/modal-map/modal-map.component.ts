import { Component, OnInit } from '@angular/core';
import { LocationService } from '@core/services/location.service';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-modal-map',
  templateUrl: './modal-map.component.html',
  styleUrls: ['./modal-map.component.css']
})
export class ModalMapComponent implements OnInit {

  constructor(private locationService:LocationService ,private mapService: MapService) { }

  ngOnInit(): void {
    this.locationService.getPosition().then( pos => {
      this.mapService.buildMap(pos.lng, pos.lat, true)
    })
  }

}
