import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/classes_services/user.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css'],
})
export class TableUserComponent implements OnInit {
  
  userList: User[];
  //listaFiltrada: User[];
  fbUID : string = '';
  fbName : string = '';
  fbNick : string = '';
  fbEmail : string = '';

  constructor(private userService: UserService, private toastr : ToastrService) {
    this.obtenerUsuarios();
  }

  ngOnInit(): void {}

  deleteUser(uid: string){
    //this.userService.delete_User(uid);
    this.toastr.success("Eliminado Correctamente", "", {timeOut: 1000});
  }
  /*
  realizarBusqueda(search: string) {
    this.listaFiltrada = this.userList.slice();
    console.log(this.listaFiltrada);
    this.listaFiltrada = this.listaFiltrada.filter((user) =>
      user.uid.includes(search)
    );
  }
  */
  obtenerUsuarios(): void {
    this.userService
      .get_AllUsers()
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({
            id: c.payload.doc.id,
            ...c.payload.doc.data(),
          }))
        )
      )
      .subscribe((data) => {
        this.userList = data;
        this.userList = this.userList.filter(user => !user.isAdmin);  //Delete the Admin Users. It has no sense to keep them
        //console.log(this.userList);
      });
  }

  /*
    this.userService.get_AllUsers().subscribe(users => {
      this.userList = users.map(e => {
          return {
            uid: e.payload.doc.id,
            email: e.payload.doc.data()['email'],
            fullName: e.payload.doc.data()['fullName'],
            nickName: e.payload.doc.data()['nickName'],
            photoURL: e.payload.doc.data()['photoURL'],
            isAdmin: e.payload.doc.data()['isAdmin'],
            likes: e.payload.doc.data()['likes'],
            followers: e.payload.doc.data()['followers'],
            followed: e.payload.doc.data()['followed'],
            visited: e.payload.doc.data()['visited']
          }
      })
      
      this.userList = this.userList.filter(user => user.uid.includes(busqueda)); 
     })
     
    //console.log(this.userService.getUser("0CqVyuAGYHfl6hTPHNmmjSQdv7D3"));
    //this.userList = this.userService.getAllUsersList().filter(user => user.uid.includes(busqueda));
 }*/
}
