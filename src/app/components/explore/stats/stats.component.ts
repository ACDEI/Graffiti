import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { GameService } from '@core/services/game.service';
import { auth } from 'firebase';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  photo:string;
  name:string;
  level: number;
  progress: number[];

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));

    this.name = usuario.fullName;
    this.photo = usuario.photoURL;

    this.gameService.level.subscribe( a => {
      this.level = a[0];
      this.progress = [a[1],a[2]];
    })
  }

}
