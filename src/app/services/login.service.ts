import { Injectable } from '@angular/core';

import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  usuariosList: AngularFireList<User>;
  userSelected: User = new User(); 
  
  constructor(private firebase: AngularFireDatabase) { }

  getUsers(){
    return this.usuariosList = this.firebase.list("usuarios");
  }

  insertUser(user: User){
     this.usuariosList.push({email: user.email,
     password: user.password});
  }

}
