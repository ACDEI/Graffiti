import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, NavigationExtras} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import { Observable } from 'rxjs';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected: User = new User(); 
  
  constructor(private router: Router, public firestore: AngularFirestore) {
    
    this.usuariosObservables = this.firestore.collection("users").valueChanges();

   }

  getUsers(){ //Obtener la lista de todos los Usuarios
    return this.usuariosObservables;
  }

  insertUser(user: User){ //Insertar un usuario en la BD
     return this.firestore.collection("users").doc(user.uid).set({
      email: user.email,
      nombreCompleto: user.fullName,
      nombreUsuario: user.nickName,
      perfilFotoUrl: user.photoURL,
      isAdmin:user.isAdmin

  })
  }

  getUser(uid: string){ //Devolver si esta o no en la BD 
     return this.firestore.collection('users').doc(uid).get().subscribe();
     //return  this.firestore.doc('usuarios/' + uid).get();
     
  }

  //Facebook LogIn
  loginFacebook(){
    var provider = new firebase.auth.FacebookAuthProvider();
    let self = this;
    firebase.auth().signInWithPopup(provider).then(function(result){

    

      self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":result.user.displayName,
                            "nickName": "", "photoURL": result.user.photoURL, "isAdmin": false};
  
      self.insertUser(self.userSelected);

      /*

      let navigationExtras: NavigationExtras = {
        queryParams: self.loginService.userSelected
      }
      self.router.navigate(['home'], navigationExtras);

      */
     
     //window.sessionStorage.setItem("idusuario", self.loginService.userSelected.uid);
     
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
  //Twitter LogIn
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
      var user = result.user; // The signed-in user info.
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
    })
  }

  //Google LogIn

  loginGoogle(){
    var provider = new firebase.auth.GoogleAuthProvider;
    let self = this;
    firebase.auth().signInWithPopup(provider).then(function(result){


      self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":result.user.displayName,
                            "nickName": "", "photoURL": result.user.photoURL, "isAdmin": false};
  
      self.insertUser(self.userSelected);

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
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {
          window.alert("You have been successfully registered!");
          console.log(result.user);
  
          self.userSelected = {"uid":result.user.uid, "email":result.user.email, "fullName":"",
                              "nickName": "", "photoURL": "", "isAdmin": false
                               };
  
          this.insertUser(self.userSelected);
        }).catch((error) => {
          window.alert(error.message)
        })
    }
      // LogIn - LogOut
  signIn(email: string, pass: string){

    let self = this;
    firebase.auth().signInWithEmailAndPassword(email, pass)
    .then(function(firebaseUser) {
      // Success 
      console.log(firebaseUser);
      self.router.navigate(['admin/home']);
    }).catch(function(error) {
      // Error Handling
      var error = error.code;
      var errorMessage = error.message;
      console.log(error.code);
 });
}

signOutAdmin(){

  let self = this;
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    self.userSelected = new User(); 
    self.router.navigate(['admin']);
  }).catch(function(error) {
    // An error happened.
  });
  
}

signOut(){

  let self = this;
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    self.userSelected = new User(); 
    self.router.navigate(['']);
  }).catch(function(error) {
    // An error happened.
  });
  
}


}
