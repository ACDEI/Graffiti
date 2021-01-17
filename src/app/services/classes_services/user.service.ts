import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { User, UserI } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<User>;

  private path = 'users';

  constructor(private fs: AngularFirestore, private http : HttpClient, 
    private auth: AuthService) { 
    this.userCollection = fs.collection(this.path);
  }

  get_AllUsers() : AngularFirestoreCollection<User> {
    return this.userCollection;
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

  async getAllUsersNoAdminPerNickOrFull(nick : string, name : string) {
    //console.log(nick + name);
    var res : any[] = [];
    await this.fs.collection('users', ref => 
      ref.where('isAdmin', '==', false)).get().toPromise().then(u => {
        u.docs.forEach(d => {
          if(d.get('nickName').toLowerCase().includes(nick.toLowerCase()) && 
              d.get('fullName').toLowerCase().includes(name.toLowerCase())) res.push(d.data());
        })
      })
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  addTokens(accessToken : string,tokenSecret: string, uid: string){
    this.fs.doc('users/'+uid).update({accessToken: accessToken, tokenSecret: tokenSecret});
  }

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

    return new Promise<UserI>( (resolve,reject) => {
      resolve(res);
    });
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

  /*
    updateUser(user: User) : Promise<void>{ return this.fs.doc('users/' + user.uid).update(user); }
    deleteUser(uid: string) : Promise<void>{ return this.userCollection.doc(uid).delete();}
  */

  //FOLLOWERS
  private followers = 'followers';
  getFollowersPerUser(uid : any) : Observable<any> {
    //console.log(uid);
    return this.fs.collection(this.path).doc(uid).collection(this.followers)
    .valueChanges()
    .pipe( map(c => c) );
  }

  //FOLLOWED
  private followed = 'followed';
  getFollowedPerUser(uid : any) : Observable<any> {
    //console.log(uid);
    return this.fs.collection(this.path).doc(uid).collection(this.followed)
    .valueChanges()
    .pipe( map(c => c) );
  }

  //LIKES
  private likes = 'likes';
  getLikesPerUser(uid : any) : Observable<any> {
    //console.log(uid);
    return this.fs.collection(this.path).doc(uid).collection(this.likes)
    .valueChanges()
    .pipe( map(c => c) );
  }

  async isLikeFromUser(uid : string, pid : string) : Promise<any> {
    var res : any;
    await this.fs.collection('users').doc(uid).collection('likes').doc(pid).get()
      .toPromise().then(l => {
        res = l.exists;
      });
      return new Promise<any>( (resolve,reject) => {
        resolve(res);
      });
  }

  //VISITADOS
  private visitados = 'visitados';
  getVisitadosPerUser(uid : any) : Observable<any> {
    //console.log(uid);
    return this.fs.collection(this.path).doc(uid).collection(this.visitados)
    .valueChanges()
    .pipe( map(c => c) );
  }


  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  //CLOUD FUNCTIONS USER
  //GETS
  private api = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/users/';

  async getAllUsersCF() : Promise<Observable<any[]>> { //Get All Users
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.api, httpOpt);
  }

  async getUserByUidCF(uid : any) : Promise<Observable<any[]>> { //Get USer By UID
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.api + uid, httpOpt);
  }

  async getUserByEmailCF(email : any) : Promise<Observable<any[]>> { //Get User By Email
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.api + 'email/' + email, httpOpt);
  }

  async getUserByAdminCF(admin : Number) : Promise<Observable<any[]>> { //Get List of (no) Admin : 1 (isAdmin), 0 (!isAdmin)
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.api + 'admin/' + admin, httpOpt);
  }

  async getUsersByRangeCF(from : Number, to : Number) : Promise<Observable<any[]>> { //Get Users By Range : From-To
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any>(this.api + 'range/' + from + '/' + to, httpOpt);
  }

  async getUsersCountCF() : Promise<Observable<Number>> { //Get Quantity of Users
    let httpOpt = await this.auth.getHeader();
    return this.http.get<Number>(this.api + 'count', httpOpt);
  }

  async getUsersCount(): Promise<any> {
    var res : any;
    await this.fs.collection(this.path).get().toPromise().then( p => {
      res = p.size;
      //console.log(res);
    });

    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
  }

  async getUsersByNameCF(name : any) : Promise<Observable<any[]>> { //Get Users By Name (fragment)
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.api + 'name/' + name, httpOpt);
  }

  //Mirar la innecesaria

  //PUT
  async putUsersCF(uid : any, usr : any) { //Update a User
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.api + uid, usr, httpOpt).subscribe();
  }

  //POST
  async postUsersCF(usr : any) { //Post a User
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.api, usr, httpOpt).subscribe();
  }

  //DELETE
  async deleteUsersCF(uid : any) { //Delete a User
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.api + uid, httpOpt).subscribe();
  }

  //FOLLOWERS
  
  private apiFollowers = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/followers/';
  
  
  //GET
  async getFollowersPerUserCF(uid : any) : Promise<Observable<any[]>> {  //Followers by User UID 
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.apiFollowers + uid, httpOpt);
  }

  async getFollowersCountPerUserCF(uid : any) : Promise<Observable<Number>> {  //Quantity of Followers By UID
    let httpOpt = await this.auth.getHeader();
    return this.http.get<Number>(this.apiFollowers + 'count/' + uid, httpOpt);
  }

  //PUT
  /*
    Update a Follower From a User
      * uid : Main User UID
      * uidF : Follower UID
      * usr : Follower Data
  */
  async putFollowerPerUser(uid : any, uidF : any, usr : any) {  
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.apiFollowers + uid + '&' + uidF, usr, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Follower To a User
      * uid : Main User UID
      * uidF : Follower Data
  */
  async postFollowerPerUser(uid : any, usrF : any) { //
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.apiFollowers + uid, usrF, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Follower To a User
      * uid : Main User UID   
      * uidF : Follower UID
  */
  async deleteFollowerPerUser(uid : any, uidF : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.apiFollowers + uid + '&' + uidF, httpOpt).subscribe();
  }

  //FOLLOWED

  private apiFollowed = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/followed/';
  
  //GET
  async getFollowedPerUserCF(uid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.apiFollowed + uid, httpOpt);
  }

  async getFollowedCountPerUserCF(uid : any) : Promise<Observable<Number>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<Number>(this.apiFollowed + 'count/' + uid, httpOpt);
  }

  //PUT
  /*
    Put a Follower To a User
      * uid : Main User UID
      * uidF : Followed UID
      * usr : Followed
  */
  async putFollowedPerUserCF(uid : any, uidF : any, usr : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.apiFollowed + uid + '&' + uidF, usr, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Followed To a User
      * uid : Main User UID
      * uidF : Followed Data
  */
  async postFollowedPerUserCF(uid : any, usrF : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.apiFollowed + uid, usrF, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Followed To a User
      * uid : Main User UID
      * uidF : Followed UID
  */
  async deleteFollowedPerUserCF(uid : any, uidF : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.apiFollowed + uid + '&' + uidF, httpOpt).subscribe();
  }

  //LIKES
  
  private apiLikes = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/users/likes';
  
  async getLikesPerUserCF(uid : any) : Promise<Observable<any[]>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<any[]>(this.apiLikes + '/' + uid, httpOpt);
  }

  async getLikesCountPerUserCF(uid : any) : Promise<Observable<Number>> {
    let httpOpt = await this.auth.getHeader();
    return this.http.get<Number>(this.apiLikes + 'count/' + uid, httpOpt);
  }

  //PUT
  /*
    Put a Like To a User
      * uid : Main User UID
      * pid : Publication PID
      * pub : Publication Data
  */
  async putLikeToUserCF(uid : any, pid : any, pub : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.put(this.apiLikes + '/' + uid + '&' + pid, pub, httpOpt).subscribe();
  }

  //POST
  /*
    Post a Like To a User
      * uid : Main User UID
      * pub : Publication Data
  */
  async postLikeToUserCF(uid : any, pub : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.post(this.apiLikes + '/' + uid, pub, httpOpt).subscribe();
  }

  //DELETE
  /*
    Delete a Like From a User
      * uid : Main User UID
      * pid : Publication PID
  */
  async deleteLikeFromUserCF(uid : any, pid : any) {
    let httpOpt = await this.auth.getHeader();
    return this.http.delete(this.apiLikes + '/' + uid + '&' + pid, httpOpt).subscribe();
  }

}
