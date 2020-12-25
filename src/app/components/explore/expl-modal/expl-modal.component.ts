import { Component, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { ExplorationService, SelectedPub } from '@core/services/exploration.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expl-modal',
  templateUrl: './expl-modal.component.html',
  styleUrls: ['./expl-modal.component.css']
})
export class ExplModalComponent implements OnInit {

  dataSubsc$: Observable<SelectedPub>;
  publication: Publication;
  selected: boolean;
  near: boolean;

  constructor(private service: ExplorationService) { 
    this.publication = undefined;
    this.selected = false;
    this.near = false;
    this.dataSubsc$ = this.service.data;
  }

  addVisitadas() {
    if(this.near) {
      this.selected = false;
    }
  }

  ngOnInit(): void {
    this.dataSubsc$.subscribe( data => {
      if(data != undefined){
        console.log("Lado componente: " + data.pub.title);
        this.publication = data.pub;
        this.near = data.near;
        this.selected = true;
      }
    });
  }

  ngOnDestroy(): void {

  }

}
