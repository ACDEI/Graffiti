import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/models/user';
import {LoginService} from "../../services/login.service";

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html' ,
  styleUrls: [ './login.component.css' ]
})

export class LoginComponent implements OnInit {

  @Output() passData : EventEmitter<boolean> = new EventEmitter<boolean>();
  viewButton : boolean = false;

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

  goingBack(){
    this.viewButton = !this.viewButton;
    this.passData.emit(this.viewButton);
  }

}
