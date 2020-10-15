import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import {LoginService} from "../../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html' ,
  styles: [
  ]
})
export class LoginComponent implements OnInit {

  constructor(public loginService: LoginService) { }

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

}
