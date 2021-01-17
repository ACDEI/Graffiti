import { Component, OnInit} from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import {Router, NavigationExtras} from '@angular/router';
import * as firebase from 'firebase';
import { rejects } from 'assert';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  loginFacebook(){
    this.authService.loginFacebook();
  }

  loginTwitter(){
    this.authService.loginTwitter();
  }

  loginGoogle(){
    try{
      this.authService.loginGoogle();
    }catch(error){
      //console.log("Button login" + error)
    }
  }
}