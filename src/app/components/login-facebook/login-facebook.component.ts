import { collectExternalReferences } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { LoginService } from '@core/services/login.service';
import * as firebase from 'firebase';
import {User} from '../../models/user';


@Component({
  selector: 'app-login-facebook',
  templateUrl: './login-facebook.component.html',
  styleUrls: ['./login-facebook.component.css']
})
export class LoginFacebookComponent implements OnInit {



  constructor(private ls: LoginService) { 
  
  }


  ngOnInit(): void {
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
