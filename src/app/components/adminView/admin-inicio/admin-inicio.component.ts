import { Component, OnInit } from '@angular/core';
import { LoginService } from '@core/services/login.service';

@Component({
  selector: 'app-admin-inicio',
  templateUrl: './admin-inicio.component.html',
  styleUrls: ['./admin-inicio.component.css']
})
export class AdminInicioComponent implements OnInit {

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  signOut(){
    this.loginService.signOut();
  }

}
