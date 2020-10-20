import { Component, Input, OnInit } from '@angular/core';
import { LoginComponent } from '../components/login/login.component';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  viewButtons : boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

  loginVisible(value : boolean){
    console.log("value:" + value);
    this.viewButtons = value;
  }
}
