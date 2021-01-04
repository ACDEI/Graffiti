import { Component, Input, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-pub-map',
  templateUrl: './pub-map.component.html',
  styleUrls: ['./pub-map.component.css']
})
export class PubMapComponent implements OnInit {

  @Input()
  publication:Publication;

  constructor() { }

  ngOnInit(): void {
  }

}
