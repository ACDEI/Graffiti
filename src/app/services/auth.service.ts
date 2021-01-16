import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "@angular/fire/firestore";
import { Observable } from 'rxjs';

import { User, UserI } from '../models/user.model';
import { UserService } from './classes_services/user.service';
import { AdminInicioComponent } from '@core/components/adminView/admin-inicio/admin-inicio.component';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected: User = new User();

  constructor(private router: Router, public firestore: AngularFirestore
              , public userService: UserService, private afAuth: AngularFireAuth) { }

  //Facebook LogIn
  loginFacebook(){

    try {
      return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(result => {
          this.userService.loginUser(result.user).then( user => {
            window.sessionStorage.setItem("usuario",JSON.stringify(user));
            this.router.navigate(['home']);
          });
        });
    } catch(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      console.log(errorMessage);
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
            this.router.navigate(['home']);
          });

          //Guardar los datos en la bd
          console.log(result.credential);
          console.log(result.credential['accessToken']);
          
          this.userService.addTokens(result.credential['accessToken'],result.credential['secret'],result.user.uid);
          
      }
    });
  } catch (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    var email = error.email;  // The email of the user's account used.
    var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
    console.log(errorMessage);
    }
  }
  

  //Google LogIn
  loginGoogle(){
    
    try{
      return this.afAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then( result => {
        
        this.userService.loginUser(result.user).then( user => {
          window.sessionStorage.setItem("usuario", JSON.stringify(user));
          this.router.navigate(['home']);
        });

      });
    }catch(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      console.log("Service " + errorMessage);
    }
    
  }
  
  //Admin (Email, Pass) 
    // Register  
  signUp(email: string, password: string){
    let self = this;
    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((result) => {
        //window.alert("You have been successfully registered!");
        console.log(result.user);

        self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":"",
                            "nickName": "", "photoURL": "", "isAdmin": false, 
                            "nVisitados":0};

        self.userService.createUser(self.userSelected);
      }).catch((error) => {
        console.log(error);
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
         console.log(self.userSelected);
         self.router.navigate(["admin/home"]);
      }).catch(function(error) { // Error Handling
        var error = error.code;
        var errorMessage = error.message;
        console.log(error);
  });
}

signOut(){
  window.sessionStorage.clear(); 
  this.userSelected = null;
  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful. 
    self.router.navigate(['']);
  }).catch(function(error) { // An error happened.
    
  });
  
}

checkTokenFacebook(){

  var usuario = firebase.auth().currentUser;
  
  var refresh = usuario.refreshToken; 

  console.log(refresh);

  console.log("---------");

  console.log(usuario.getIdToken(true));

  console.log("---------");

  var token = usuario.getIdTokenResult(true);
  token.then(el => {
    console.log("cuando caduca el token" + el.expirationTime);
    console.log(el.token);
    console.log(el.signInProvider);
  })

  

}


/*
verifyIdToken(){
  let checkRevoked = true;
  let usuario = firebase.auth().currentUser;
  let result = usuario.getIdToken(true); 
  var tokenId ; 
  result.then( element => {
    tokenId = element.toString();
  }
  );


  admin.auth().verifyIdToken(tokenId,checkRevoked).then(
    payload =>{

      console.log("token id Válido no es necesario volver a autenticar");

    }).catch(error => {
      if (error.code == 'auth/id-token-revoked') {
        // Token has been revoked. Inform the user to reauthenticate or signOut() the user.
        console.log("Es necesario reautenticar");
        var socialProvider = firebase.auth().currentUser.providerId;
        console.log(socialProvider);

        if(socialProvider == "facebook.com"){
          this.signOutFacebook();
        }
      } else {
        // Token is invalid.
        console.log("Token invalido");
        var socialProvider = firebase.auth().currentUser.providerId;
        console.log(socialProvider);
        
        if(socialProvider == "facebook.com"){
          this.signOutFacebook();
        }
      }
    })
}
*/
/*
signOutFacebook(){

  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful.
    self.router.navigate(['']);
  }).catch(function(error) { // An error happened.
    
  });
  
}
*/
}
