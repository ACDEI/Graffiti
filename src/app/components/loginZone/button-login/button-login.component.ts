import { Component, OnInit} from '@angular/core';
import { LoginService } from '@core/services/login.service';
import {Router, NavigationExtras} from '@angular/router';
import * as firebase from 'firebase';
import { rejects } from 'assert';
import { User } from '@core/models/user';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  loginFacebook(){
    this.loginService.loginFacebook();
  }

  loginTwitter(){
    this.loginService.loginTwitter();
  }
}