import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  uid:string; 

  constructor(private auth: AuthService) { 
    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));
    this.uid = usuario.uid;
  }

  ngOnInit(): void {
  }

  cerrarSesion(){
    this.uid = "";
    this.auth.userSelected = null; 
    this.auth.signOut();
  }

}
