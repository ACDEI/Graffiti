import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {Router, NavigationExtras, ActivatedRoute} from '@angular/router';
import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "@angular/fire/firestore";
import { Observable } from 'rxjs';

import { User, UserI } from '../models/user.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpHeaders } from '@angular/common/http';
import { AuxiliarUserService } from './auxiliar-user.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  isLogin = false;
  roleAs: string;
  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected : User = null;
  isTwitterConnected : boolean = false;

  constructor(private router: Router, public firestore: AngularFirestore, 
    public userService: AuxiliarUserService, private afAuth: AngularFireAuth, 
    private ts: ToastrService) { }

  //Facebook LogIn
  loginFacebook(){

    try {
      return this.afAuth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(result => {
          this.userService.loginUser(result.user).then( user => {
            this.isTwitterConnected = (user.accessToken != null && user.tokenSecret != null);
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(['home']);
          });
        }).catch(err => {
          this.ts.error('Error al iniciar sesión', '', {timeOut: 1500});
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
          this.userService.loginUser(result.user).then( user => {
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            if(user.accessToken == null || user.tokenSecret == null){
              var at = result.credential['accessToken'];
              var st = result.credential['secret'];
              var uid = JSON.parse(window.sessionStorage.getItem('usuario')).uid;
              this.isTwitterConnected = this.userService.addTokens(at, st, uid);
            } else { this.isTwitterConnected = true; }

            
            this.router.navigate(['home']);
          });
      }
    }).catch(err => {
      this.ts.error('Error al iniciar sesión', '', {timeOut: 1500});
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


    //Twitter Connect
    async conectarTwitter(){

      try {
        var twitterProvider = new firebase.auth.TwitterAuthProvider();
        let self = this;
        let user = (await this.afAuth.currentUser);
        await user.linkWithPopup(twitterProvider).then(function(result) {
          // Accounts successfully linked.
          var at = result.credential['accessToken'];
          var st = result.credential['secret'];
          var uid = JSON.parse(window.sessionStorage.getItem('usuario')).uid;
          self.isTwitterConnected = self.userService.addTokens(at, st, uid);
        }).catch(function(error) {
          // Handle Errors here.
          self.ts.warning('Esta cuenta ya ha sido vinculada a otra existente', 'Atención', {timeOut: 1500});
          throw error;
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
            this.isTwitterConnected = (user.accessToken != null && user.tokenSecret != null);
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "USER";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(['home']);
        });

      }).catch(err => {
        this.ts.error('Error al iniciar sesión', '', {timeOut: 1500});
      });
    }catch(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      //console.log("Service " + errorMessage);
    }
    
  }
  
  /*
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
  */
    // LogIn - LogOut
  signIn(email: string, pass: string){

    try{
      return this.afAuth.signInWithEmailAndPassword(email, pass).then( result => {
        this.userService.loginAdmin(result.user).then( user => {
          if(user == null) this.router.navigate(["admin"]);
          else {
            window.sessionStorage.setItem("usuario", JSON.stringify(user));
            localStorage.setItem('STATE', 'true');
            this.roleAs = "ADMIN";
            localStorage.setItem('ROLE', this.roleAs);
            this.router.navigate(["admin/home"]);
          }
        });
      }).catch(err => {
        this.ts.error('Error al iniciar sesión', '', {timeOut: 1500});
      });;
    }catch(error){
      var errorCode = error.code;
      var errorMessage = error.message;
      var emailCopy = error.email;  // The email of the user's account used.
      var credential = error.credential;  // The firebase.auth.AuthCredential type that was used.
      console.log("Service " + errorMessage);
    }
}

signOut(b? : boolean){

  let self = this;
  firebase.auth().signOut().then(function() { // Sign-out successful. 
    window.sessionStorage.clear(); 
    self.isLogin = false;
    self.roleAs = '';
    localStorage.setItem('STATE', 'false');
    localStorage.setItem('ROLE', '');
    if(b != null && b) self.router.navigate(['admin']);
    else self.router.navigate(['']);
  }).catch(function(error) { // An error happened.
    console.log('ERROR', error);
  });
  
}

  async getHeader(): Promise<{headers:HttpHeaders}> {
    
    return new Promise( async (res,rej) => {
      let user = await firebase.auth().currentUser;
      
      if(user){
        let idtoken = await user.getIdToken(false);
        
        if(idtoken) res({headers: new HttpHeaders({'Authorization': 'Bearer ' + idtoken })});
        else res(null);
      
      } else res(null);

    })
  }

  isLoggedIn() {
    const loggedIn = localStorage.getItem('STATE');
    if (loggedIn == 'true') this.isLogin = true;
    else this.isLogin = false;
    
    return this.isLogin;
  }

  getRole() {
    this.roleAs = localStorage.getItem('ROLE');
    return this.roleAs;
  }

  hasTwitter(){
    return this.isTwitterConnected;
  }

}
