import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor(private auth: AuthService) { }

  //wantRegister: boolean = false;

  ngOnInit(): void {
    this.auth.signOut();
  }

  /*
  viewRegister(show : boolean){
    this.wantRegister = show;
  }
  */

}
