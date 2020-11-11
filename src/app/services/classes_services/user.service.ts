import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection} from '@angular/fire/firestore';
import { User } from '@core/models/user.model';
import { Observable } from 'rxjs';

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

  createUser(user: User) : any{
    return this.fs.collection('users').doc(user.uid).set(user);
  }

  updateUser(user: User) : Promise<void>{
    return this.fs.doc('users/' + user.uid).update(user);
  }

  delete_User(uid: string) : Promise<void>{
    return this.userCollection.doc(uid).delete();
  }
  
}
