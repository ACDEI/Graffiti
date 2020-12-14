import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, NavigationExtras} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "@angular/fire/firestore";
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { UserService } from './classes_services/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected: User = new User();


  constructor(private router: Router, public firestore: AngularFirestore
              , public userService: UserService) {}

  //Facebook LogIn
  loginFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    let self = this; 

    var usuario = firebase.auth().currentUser;
    console.log(usuario);
    if(usuario == null){

        firebase.auth().signInWithPopup(provider).then(function(result){
          var yaRegistrado = self.userService.getUser(result.user.uid);
  
          console.log(yaRegistrado);

          var likes = [];
          var followers = [];
          var followed = [];
          var visited  = [];

          self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":result.user.displayName,
                                "nickName": "", "photoURL": result.user.photoURL, "isAdmin": false, 
                                "likes":likes, "followers": followers, "followed":followed, "visited":visited };
      
          self.userService.createUser(self.userSelected);
        
          window.sessionStorage.setItem("usuario",JSON.stringify(self.userSelected));

          self.router.navigate(['home']);
      
        

        }).catch(function(error){
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          var email = error.email;  // The email of the user's account used.
          var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
          console.log(errorMessage);
        
        })

    }else{

      self.router.navigate(['home']);

    }
  }
  //Twitter LogIn
loginTwitter(){
    var provider = new firebase.auth.TwitterAuthProvider();
    let self = this;

    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
      if (result.credential) {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
       
        // var secret = result.credential.secret;
        // ...

        self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":result.user.displayName,
                            "nickName": "", "photoURL": result.user.photoURL, "isAdmin": false, 
                            "likes": [], "followers": [], "followed": [], "visited": [] };
  
      self.userService.createUser(self.userSelected);

      window.sessionStorage.setItem("usuario",JSON.stringify(self.userSelected));

      self.router.navigate(['home']);
     
      }
      
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      console.log(errorMessage);
    })
  }

  //Google LogIn
  loginGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider;
    let self = this;
    firebase.auth().signInWithPopup(provider).then(function(result){


      self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":result.user.displayName,
                            "nickName": "", "photoURL": result.user.photoURL, "isAdmin": false, 
                            "likes": [], "followers": [], "followed": [], "visited": [] };
  
      self.userService.createUser(self.userSelected);

      console.log(self.userSelected);
     
      window.sessionStorage.setItem("usuario",JSON.stringify(self.userSelected));

      self.router.navigate(['home']);
     

    }).catch(function(error){
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      console.log(errorMessage);
     
    })
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
                            "likes": [], "followers": [], "followed": [], "visited": [] };

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
        console.log(firebaseUser);
        self.router.navigate(['admin/home']);
      }).catch(function(error) { // Error Handling
        var error = error.code;
        var errorMessage = error.message;
        console.log(error);
  });
}

signOut(){

  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful. 
    self.router.navigate(['admin']);
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
    console.log(el.expirationTime);
    console.log(el.token);
    console.log(el.signInProvider);
  })

  

}

signOutFacebook(){

  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful. 
    self.router.navigate(['']);
  }).catch(function(error) { // An error happened.
    
  });
  
}

}
