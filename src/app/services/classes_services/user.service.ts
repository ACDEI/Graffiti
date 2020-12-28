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

  getUser(uid: string): Observable<User>{
    return this.fs.doc<User>(`users/${uid}`).valueChanges();
  }

  async loginUser(user: firebase.User): Promise<UserI> {
    var res: UserI;
    await this.fs.doc('users/' + user.uid).get().toPromise().then( u => {
      if(u.exists){
        console.log("ENTRO EN IF");
        res = {
          uid: u.get("uid"),
          email: u.get("email"),
          fullName: u.get("fullName"),
          nickName: u.get("nickName"),
          photoURL: u.get("photoURL"),
          isAdmin: u.get("isAdmin"),
          likes: u.get("likes"),
          followers: u.get("followers"),
          followed: u.get("followed"),
          nVisitados: u.get("nVisitados")
        }
      }else{
        console.log("USUARIO NO EXISTE");
        res = {
          uid: user.uid,
          email: user.email,
          fullName: user.displayName,
          nickName: "",
          photoURL: user.photoURL,
          isAdmin: false,
          likes: [],
          followers: [],
          followed: [],
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
      likes:user.likes,
      followers:user.followers,
      followed:user.followed
  });
  }

  updateUser(user: User) : Promise<void>{
    return this.fs.doc('users/' + user.uid).update(user);
  }

  deleteUser(uid: string) : Promise<void>{
    return this.userCollection.doc(uid).delete();
  }

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

  //CLOUD FUNCTIONS USER
  //GETS
  private api = 'url/users/';

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
  //GET
  private apiFollowers = 'api/followers/';
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
  //GET
  private apiFollowed = 'api/followed/';
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
  putFollowedPerUser(uid : any, uidF : any, usr : any) {
    return this.http.put(this.apiFollowed + uid + '&' + uidF, usr);
  }

  //POST
  /*
    Post a Followed To a User
      * uid : Main User UID
      * uidF : Followed Data
  */
  postFollowedPerUser(uid : any, usrF : any) {
    return this.http.post(this.apiFollowed + uid, usrF);
  }

  //DELETE
  /*
    Delete a Followed To a User
      * uid : Main User UID
      * uidF : Followed UID
  */
  deleteFollowedPerUser(uid : any, uidF : any) {
    return this.http.delete(this.apiFollowed + uid + '&' + uidF);
  }

  //LIKES
  private apilikes = 'likes';
  getLikesPerUserCF(uid : any) : Observable<any[]> {
    return this.http.get<any[]>(this.api + this.apilikes + '/' + uid);
  }

  getLikesCountPerUserCF(uid : any) : Observable<Number> {
    return this.http.get<Number>(this.api + this.likes + 'count/' + uid);
  }

  //PUT
  /*
    Put a Like To a User
      * uid : Main User UID
      * pid : Publication PID
      * pub : Publication Data
  */
  putLikeToUser(uid : any, pid : any, pub : any) {
    return this.http.put(this.api + this.apilikes + '/' + uid + '&' + pid, pub);
  }

  //POST
  /*
    Post a Like To a User
      * uid : Main User UID
      * pub : Publication Data
  */
  postLikeToUser(uid : any, pub : any) {
    return this.http.post(this.api + this.apilikes + '/' + uid, pub);
  }

  //DELETE
  /*
    Delete a Like From a User
      * uid : Main User UID
      * pid : Publication PID
  */
  deleteLikeFromUser(uid : any, pid : any) {
    return this.http.delete(this.api + this.apilikes + '/' + uid + '&' + pid);
  }

}
