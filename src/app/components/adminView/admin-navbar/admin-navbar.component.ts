import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '@core/services/login.service';


@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css'],
  providers: [LoginService]
})

export class AdminNavbarComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  signOut(){
    this.loginService.signOut();
    this.router.navigate(['admin']);
  }

}
