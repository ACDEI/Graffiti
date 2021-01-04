import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { User, UserI } from '@core/models/user.model';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userCollection: AngularFirestoreCollection<User>;

  private path = 'users';

  constructor(private fs: AngularFirestore, private http : HttpClient) { 
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
        nVisitados: c.get("nVisitados")
      }

    });
    
    return new Promise<any>( (resolve,reject) => {
      resolve(res);
    });
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
          nVisitados: u.get("nVisitados")
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
          nVisitados: 0
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

  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////

  //CLOUD FUNCTIONS USER
  //GETS
  private api = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/users/';

  getAllUsersCF() : Observable<any[]> { //Get All Users
    return this.http.get<any[]>(this.api);
  }

  getUserByUidCF(uid : any) : Observable<any[]> { //Get USer By UID
    return this.http.get<any[]>(this.api + uid);
  }

  getUserByEmailCF(email : any) : Observable<any[]> { //Get User By Email
    return this.http.get<any[]>(this.api + 'email/' + email);
  }

  getUserByAdminCF(admin : Number) : Observable<any[]> { //Get List of (no) Admin : 1 (isAdmin), 0 (!isAdmin)
    return this.http.get<any[]>(this.api + 'admin/' + admin);
  }

  getUsersByRangeCF(from : Number, to : Number) : Observable<any[]> { //Get Users By Range : From-To
    return this.http.get<any>(this.api + 'range/' + from + '/' + to);
  }

  getUsersCountCF() : Observable<Number> { //Get Quantity of Users
    return this.http.get<Number>(this.api + 'count');
  }

  getUsersByNameCF(name : any) : Observable<any[]> { //Get Users By Name (fragment)
    return this.http.get<any[]>(this.api + 'name/' + name);
  }

  //Mirar la innecesaria

  //PUT
  putUsersCF(uid : any, usr : any) { //Update a User
    return this.http.put(this.api + uid, usr);
  }

  //POST
  postUsersCF(usr : any) { //Post a User
    return this.http.post(this.api, usr);
  }

  //DELETE
  deleteUsersCF(uid : any) { //Delete a User
    return this.http.delete(this.api + uid);
  }

  //FOLLOWERS
  
  private apiFollowers = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/followers/';
  
  
  //GET
  getFollowersPerUserCF(uid : any) : Observable<any[]> {  //Followers by User UID 
    return this.http.get<any[]>(this.apiFollowers + uid);
  }

  getFollowersCountPerUserCF(uid : any) : Observable<Number> {  //Quantity of Followers By UID
    return this.http.get<Number>(this.apiFollowers + 'count/' + uid);
  }

  //PUT
  /*
    Update a Follower From a User
      * uid : Main User UID
      * uidF : Follower UID
      * usr : Follower Data
  */
  putFollowerPerUser(uid : any, uidF : any, usr : any) {  
    return this.http.put(this.apiFollowers + uid + '&' + uidF, usr);
  }

  //POST
  /*
    Post a Follower To a User
      * uid : Main User UID
      * uidF : Follower Data
  */
  postFollowerPerUser(uid : any, usrF : any) { //
    return this.http.post(this.apiFollowers + uid, usrF);
  }

  //DELETE
  /*
    Delete a Follower To a User
      * uid : Main User UID   
      * uidF : Follower UID
  */
  deleteFollowerPerUser(uid : any, uidF : any) {
    return this.http.delete(this.apiFollowers + uid + '&' + uidF);
  }

  //FOLLOWED

  private apiFollowed = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/followed/';
  
  //GET
  getFollowedPerUserCF(uid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.apiFollowed + uid);
  }

  getFollowedCountPerUserCF(uid : any) : Observable<Number> {
    return this.http.get<Number>(this.apiFollowed + 'count/' + uid);
  }

  //PUT
  /*
    Put a Follower To a User
      * uid : Main User UID
      * uidF : Followed UID
      * usr : Followed
  */
  putFollowedPerUserCF(uid : any, uidF : any, usr : any) {
    return this.http.put(this.apiFollowed + uid + '&' + uidF, usr);
  }

  //POST
  /*
    Post a Followed To a User
      * uid : Main User UID
      * uidF : Followed Data
  */
  postFollowedPerUserCF(uid : any, usrF : any) {
    return this.http.post(this.apiFollowed + uid, usrF);
  }

  //DELETE
  /*
    Delete a Followed To a User
      * uid : Main User UID
      * uidF : Followed UID
  */
  deleteFollowedPerUserCF(uid : any, uidF : any) {
    return this.http.delete(this.apiFollowed + uid + '&' + uidF);
  }

  //LIKES
  
  private apiLikes = 'https://us-central1-graffiti-9b570.cloudfunctions.net/MalagArtApiWeb/users/likes';
  
  getLikesPerUserCF(uid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.apiLikes + '/' + uid);
  }

  getLikesCountPerUserCF(uid : any) : Observable<Number> {
    return this.http.get<Number>(this.apiLikes + 'count/' + uid);
  }

  //PUT
  /*
    Put a Like To a User
      * uid : Main User UID
      * pid : Publication PID
      * pub : Publication Data
  */
  putLikeToUserCF(uid : any, pid : any, pub : any) {
    return this.http.put(this.apiLikes + '/' + uid + '&' + pid, pub);
  }

  //POST
  /*
    Post a Like To a User
      * uid : Main User UID
      * pub : Publication Data
  */
  postLikeToUserCF(uid : any, pub : any) {
    return this.http.post(this.apiLikes + '/' + uid, pub);
  }

  //DELETE
  /*
    Delete a Like From a User
      * uid : Main User UID
      * pid : Publication PID
  */
  deleteLikeFromUserCF(uid : any, pid : any) {
    return this.http.delete(this.apiLikes + '/' + uid + '&' + pid);
  }

}
