import { Component, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-not-found404',
  templateUrl: './not-found404.component.html',
  styleUrls: ['./not-found404.component.css']
})
export class NotFound404Component implements OnInit {

  logged: string;
  usuarioSesion: any = null;

  constructor(private authService: AuthService, private route: ActivatedRouteSnapshot, private router: Router) { }

  ngOnInit(): void {
  if (this.authService.isLoggedIn()) {
      const userRole = this.authService.getRole();  //ADMIN o USER
      if (this.route.data.role && this.route.data.role.indexOf(userRole) === -1) {
        if(userRole === 'ADMIN') this.logged = "a";
        else if(userRole === 'USER') {
          this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
          this.logged = "b";
        }
        else { this.logged = "c"; }
      }
      this.logged = "c";
    }
    this.logged = "c";
  }


}
