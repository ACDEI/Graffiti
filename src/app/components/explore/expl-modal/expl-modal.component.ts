import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase';
import { Publication } from '@core/models/publication';
import { UserI } from '@core/models/user.model';
import { ExplorationService, SelectedPub } from '@core/services/exploration.service';
import { Observable } from 'rxjs';
import { GameService } from '@core/services/game.service';

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

  constructor(private service: ExplorationService, private gameService: GameService, private firestore: AngularFirestore) { 
    this.publication = undefined;
    this.selected = false;
    this.near = false;
    this.dataSubsc$ = this.service.data;
  }

  addVisitadas() {
    if(this.near) {
      this.selected = false;

      this.gameService.addVisitados(this.publication);
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
