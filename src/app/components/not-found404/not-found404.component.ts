import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-not-found404',
  templateUrl: './not-found404.component.html',
  styleUrls: ['./not-found404.component.css']
})
export class NotFound404Component implements OnInit {

  logged: string;
  usuarioSesion: any = null;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
        const userRole = this.authService.getRole();  //ADMIN o USER
        if(userRole === 'ADMIN') {
          this.logged = "a";
        } else if(userRole === 'USER') {
          this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
          this.logged = "b";
        } else { 
          this.logged = "c"; 
        }
    } else {
      this.logged = "c";  
    }

  }


}
