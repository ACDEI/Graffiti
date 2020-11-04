import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {Router, NavigationExtras} from '@angular/router';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/classes_services/user.service';
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.css']
})
export class RegisterFormComponent implements OnInit {

  email: string;
  password: string;

  errorMessage = ""; // Validation Error Handle
  error: {name: string, message: string} = {name: "", message: ""}; //Firebase Error Handle

  @Output() wantRegister: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public authService: AuthService, private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  resetForm(){
    this.email = "";
    this.password = "";
  }

  goingBack(){
    this.wantRegister.emit(false);
    //let self = this;
    //self.router.navigate(['']);
  }

  clearErrorMessage(){
    this.errorMessage = "";
    this.error = {name: "", message: ""};
  }

  async signUp(){
    this.clearErrorMessage();
    if(this.validateForm(this.email, this.password)){
      this.authService.signUp(this.email, this.password).then(() => {
        this.router.navigate[('admin/home')];
      }).catch( _error => {
        this.error = _error;
        this.resetForm();
      })
    } else {
      this.resetForm();
    }
  }

  validateForm(email, pass){
    if(email.length === 0 || pass.length === 0) {
      this.errorMessage="Complete both fields.";
      return false;
    }
    if(pass.length < 6) {
      this.errorMessage = "Password must have 6 characters at least.";
      return false;
    }
    this.errorMessage='';
    return true;
  }
}
