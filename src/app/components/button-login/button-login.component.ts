import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '@core/services/login.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {

  @Output() passData : EventEmitter<boolean> = new EventEmitter<boolean>();
  viewButton : boolean = true;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {
  }

  changeLog(){
    this.viewButton = !this.viewButton;
    this.passData.emit(this.viewButton);
  }

  loginFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result){
  
      var token = result.credential;
      console.log(result.user.email);
      

    }).catch(function(error){
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
    })
  }

}
