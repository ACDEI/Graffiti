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

  constructor(private fs: AngularFirestore) { 
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
        res = {
          uid: user.uid,
          email: user.email,
          fullName: "",
          nickName: user.displayName,
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
    })
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
}
