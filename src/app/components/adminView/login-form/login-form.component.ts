import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
import { User } from 'src/app/models/user.model';
import {LoginService} from "../../../services/login.service";

import * as firebase from 'firebase';

@Component({
  selector: 'app-login-form',
  templateUrl: 'login-form.component.html' ,
  styleUrls: [ './login-form.component.css' ]
})

export class LoginFormComponent implements OnInit {

  email: string;
  password: string;

  constructor(public loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.loginService.getUsers();
    this.resetForm();
  }

  onSubmit(userForm: NgForm){
    this.loginService.insertUser(userForm.value);
    this.resetForm(userForm);
  }
  
  resetForm(userForm?: NgForm){
    if(userForm != null){
      userForm.reset();
       this.loginService.userSelected = new User(); 
    }
  }

  goingBack(){
    let self = this;
    self.router.navigate(['']);
  }

  async signIn(userForm : NgForm){
    this.loginService.signIn(userForm.value.email, userForm.value.name);
  }
}
