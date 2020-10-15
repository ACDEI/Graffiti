import { Component, OnInit } from '@angular/core';
import {LoginService} from "../services/login.service";
import {User} from "../models/user";
import {AngularFireList} from "angularfire2/database";

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.component.html',
  styleUrls: ['./lista-usuarios.component.css']
})
export class ListaUsuariosComponent implements OnInit {

  usersList: AngularFireList<User>;  
  listaUsuarios: User[] ;

  constructor(private loginService: LoginService) { 
  
  }

  ngOnInit(): void {
   
  this.loginService.getUsers().snapshotChanges().forEach(lambda => {
   this.listaUsuarios = [];
   lambda.forEach(child => {
     let user = child.payload.toJSON();
     user['$key'] = child.key;
     this.listaUsuarios.push(user as User);
   });
  });
    
  }

 

}
