import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
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

  constructor(private auth: AuthService) {



    console.log(auth.userSelected.fullName)
    this.name = auth.userSelected.fullName
    this.photo = auth.userSelected.photoURL
    this.level = 30
    this.progress = [15,1000]
  }

  ngOnInit(): void {
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));

    console.log(usuario.fullName)
    this.name = usuario.fullName
    this.photo = usuario.photoURL
    this.level = 30
    this.progress = [15,1000]
  }

}
