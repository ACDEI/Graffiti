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
          flickrTokens: u.get("flickrTokens")
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
          flickrTokens: null
        }
        this.fs.doc('users/' + user.uid).set(res)
      }
    })
 
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  async addTokens(accessToken : string,tokenSecret: string, uid: string){
    await this.fs.doc('users/'+uid).update({accessToken: accessToken, tokenSecret: tokenSecret});
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
