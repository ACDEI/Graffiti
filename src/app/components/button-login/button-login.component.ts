import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LoginService } from '@core/services/login.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-button-login',
  templateUrl: './button-login.component.html',
  styleUrls: ['./button-login.component.css']
})
export class ButtonLoginComponent implements OnInit {

  @Output() passData : EventEmitter<boolean> = new EventEmitter<boolean>();
  viewButton : boolean = true;

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
  }

  changeLog(){
    this.viewButton = !this.viewButton;
    this.passData.emit(this.viewButton);
  }

  loginFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    
    let self = this;
    firebase.auth().signInWithPopup(provider).then(function(result){
      var token = result.credential;
      //console.log(result.user.email);
      self.router.navigate(['home',result.user.uid]);

    }).catch(function(error){
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorMessage);
    })
  }

  loginTwitter(){
    var provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        var token = result.credential;
       // var secret = result.credential.secret;
        // ...
      }
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
    })
  }
}
    
  


  


