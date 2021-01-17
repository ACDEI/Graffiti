import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router, NavigationExtras} from '@angular/router';
import { User } from '@core/models/user.model';
import { AuthService } from "../../../../services/auth.service";
import * as admin from 'firebase-admin';
import * as firebase from 'firebase';
import { customClaims } from '@angular/fire/auth-guard';
import { AdminInicioComponent } from '../../admin-inicio/admin-inicio.component';

@Component({
  selector: 'app-login-form',
  templateUrl: 'login-form.component.html' ,
  styleUrls: [ './login-form.component.css' ]
})

export class LoginFormComponent implements OnInit {

  email: string;
  password: string;

  errorMessage = ""; // Validation Error Handle
  error: {name: string, message: string} = {name: "", message: ""}; //Firebase Error Handle

  constructor(public authService: AuthService, private router: Router) { }

  //@Output() wantRegister: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit(): void {
  }
  
  resetForm(){
    this.email = "";
    this.password = "";
  }

  clearErrorMessage(){
    this.errorMessage = "";
    this.error = {name: "", message: ""};
  }

  signIn(){
    
    this.clearErrorMessage();
    if(this.validateForm(this.email, this.password)){
      this.authService.signIn(this.email, this.password).then().catch( _error => {
        this.error = _error;
        this.resetForm();
      })
    } else this.resetForm();
  }

  validateForm(email, pass){
    if(email.length === 0 || pass.length === 0) {
      this.errorMessage="Rellena ambos campos.";
      return false;
    }
    if(pass.length < 6) {
      this.errorMessage = "La contraseña debe tener al menos 6 carácteres";
      return false;
    }
    this.errorMessage='';
    return true;
  }

}
