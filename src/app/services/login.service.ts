import { Injectable } from '@angular/core';

import {AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection} from "angularfire2/firestore";
import { Observable } from 'rxjs';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  coleccionUsuarios: AngularFirestoreCollection<User>;
  usuariosObservables: Observable<any[]>;
  userSelected: User = new User(); 
  
  constructor(public firestore: AngularFirestore) {
    
    this.usuariosObservables = this.firestore.collection("usuarios").valueChanges();
    
   }

  getUsers(){
    return this.usuariosObservables;
  }

  insertUser(user: User){
    
     return this.firestore.collection("usuarios").add({email: user.email, password : user.password});
  }


}
