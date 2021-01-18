import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, UserI } from '@core/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuxiliarUserService {

  constructor(private fs: AngularFirestore) { }

  async loginUser(user: firebase.User): Promise<UserI> {
    var res: UserI;
    await this.fs.doc('users/' + user.uid).get().toPromise().then( u => {
      if(u.exists){
        res = {
          uid: u.get("uid"),
          email: u.get("email"),
          fullName: u.get("fullName"),
          nickName: u.get("nickName"),
          photoURL: u.get("photoURL"),
          isAdmin: u.get("isAdmin"),
          nVisitados: u.get("nVisitados"),
          flickrTokens: u.get("flickrTokens"),
          accessToken: u.get('accessToken'),
          tokenSecret: u.get('tokenSecret')
        }
      } else {
        var nickName : string;
        nickName = user.email.substring(0, user.email.indexOf('@'));

        if(user.photoURL === null || user.photoURL === '') 
          user.photoURL = 'https://imgur.com/a/hKt8Gev';  //Default Avatar User

        res = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          nickName: nickName,
          photoURL: user.photoURL,
          isAdmin: false,
          nVisitados: 0,
          flickrTokens: null,
          accessToken: null,
          tokenSecret: null
        }
        this.fs.doc('users/' + user.uid).set(res)
      }
    })
 
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  async loginAdmin(user: firebase.User): Promise<UserI> {
    var res: UserI;
    await this.fs.doc('users/' + user.uid).get().toPromise().then( u => {
      if(u.exists){
        var isAdmin = u.get('isAdmin');
        console.log(isAdmin);
        if(isAdmin){
          res = {
            uid: u.get("uid"),
            email: u.get("email"),
            fullName: u.get("fullName"),
            nickName: u.get("nickName"),
            photoURL: u.get("photoURL"),
            isAdmin: u.get("isAdmin"),
            nVisitados: u.get("nVisitados"),
            flickrTokens: u.get("flickrTokens"),
            accessToken: u.get('accessToken'),
            tokenSecret: u.get('tokenSecret')
          }
        } else res = null;
      } else {
        res = null;
      }
    })
 
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  async getUser(uid: string): Promise<any>{
    var res : any;
    await this.fs.doc(`users/${uid}`).get().toPromise().then( c => {
      res = {
        uid : c.get('uid'),
        nickName : c.get('nickName'),
        photoURL : c.get('photoURL'),
        email: c.get("email"),
        fullName: c.get("fullName"),
        isAdmin: c.get("isAdmin"),
        nVisitados: c.get("nVisitados"),
        accessToken: c.get('accessToken'),
        tokenSecret: c.get('tokenSecret')
      }

    });
    
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  addTokens(accessToken: string, tokenSecret: string, uid: string){
    var res = false;
    this.fs.doc('users/'+uid).update({accessToken: accessToken, tokenSecret: tokenSecret}).then(
      async success => { 
        res = true;
        var u = JSON.parse(window.sessionStorage.getItem('usuario'));
        await this.getUser(u).then(user => {
          window.sessionStorage.setItem('usuario', JSON.stringify(user));
        })
      },
      err => { res = false; }
    );
    return res;
  }

  
  createUser(user: User) : any{
    return this.fs.collection('users').doc(user.uid).set({
      email:user.email,
      fullName:user.fullName,
      nickName:user.nickName,
      photoURL:user.photoURL,
      isAdmin:user.isAdmin,
      nVisitados : 0,
    });
  }
}
