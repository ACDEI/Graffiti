import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "@angular/fire/firestore";
import { Observable } from 'rxjs';

import { User, UserI } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpHeaders } from '@angular/common/http';
import { AuxiliarUserService } from './auxiliar-user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLogin = false;
  roleAs: string = '';
  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected: User = new User();

  constructor(private router: Router, public firestore: AngularFirestore, 
    public userService: AuxiliarUserService, private afAuth: AngularFireAuth) { }

  //Facebook LogIn
  loginFacebook(){

    try {
      return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(result => {
          this.userService.loginUser(result.user).then( user => {
            window.sessionStorage.setItem("usuario",JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(['home']);
          });
        });
    } catch(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      //console.log(errorMessage);
    }
  }

  //Twitter LogIn
  async loginTwitter(){

    try {
      return this.afAuth.signInWithPopup(new firebase.auth.TwitterAuthProvider())
        .then( result => {
          if (result.credential) {
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            // var secret = result.credential.secret;
          this.userService.loginUser(result.user).then( user => {
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(['home']);
            this.router.navigate(['home']);
          });

          //Guardar los datos en la bd
          //console.log(result.credential);
          //console.log(result.credential['accessToken']);
          
          this.userService.addTokens(result.credential['accessToken'], result.credential['secret'], result.user.uid);
          
      }
    });
  } catch (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;  // The email of the user's account used.
    var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
    //console.log(errorMessage);
    }
  }
  

  //Google LogIn
  loginGoogle(){
    
    try{
      return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then( result => {
        
        this.userService.loginUser(result.user).then( user => {
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(['home']);
        });

      });
    }catch(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      //console.log("Service " + errorMessage);
    }
    
  }
  
  //Admin (Email, Pass) 
    // Register  
  signUp(email: string, password: string){
    let self = this;
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //window.alert("You have been successfully registered!");
        //console.log(result.user);

        self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":"",
                            "nickName": "", "photoURL": "", "isAdmin": false, 
                            "nVisitados":0};

        self.userService.createUser(self.userSelected);
      }).catch((error) => {
        //console.log(error);
        throw error;
      })
  }
    // LogIn - LogOut
  signIn(email: string, pass: string){

    let self = this;
    return firebase.auth().signInWithEmailAndPassword(email, pass)
      .then(function(firebaseUser) {  // Success 
        
         self.userSelected = {"uid":firebaseUser.user.uid, "email":firebaseUser.user.email, "fullName":firebaseUser.user.displayName,
                              "nickName": "", "photoURL": "", "isAdmin": true, "nVisitados" : 0 };
         //console.log(self.userSelected);
         localStorage.setItem('STATE', 'true');
         this.roleAs = "ADMIN";
         localStorage.setItem('ROLE', this.roleAs);
         self.router.navigate(["admin/home"]);
      }).catch(function(error) { // Error Handling
        var error = error.code;
        var errorMessage = error.message;
        //console.log(error);
  });
}

signOut(){

  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful. 
    window.sessionStorage.clear(); 
    self.userSelected = null;
    self.isLogin = false;
    self.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    console.log('HAGO LOGOUT', self.roleAs);
    self.router.navigate(['']);
  }).catch(function(error) { // An error happened.
    console.log('ERROR', error);
  });
  
}

  async getHeader(): Promise<{headers:HttpHeaders}> {
    return new Promise( async (res,rej) => {
      let user = await firebase.auth().currentUser;
      if(user){
        let idtoken = await user.getIdToken(false);
        if(idtoken) {
          res({headers: new HttpHeaders({'Authorization': 'Bearer ' + idtoken })});
        }else{
          res(null);
        }
      }else{
        res(null);
      }
    })
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true')
      this.isLogin = true;
    else
      this.isLogin = false;
    return this.isLogin;
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }
}
