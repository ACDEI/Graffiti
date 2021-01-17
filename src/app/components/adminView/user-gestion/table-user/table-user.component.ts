import { Component, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/classes_services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-table-user',
  templateUrl: './table-user.component.html',
  styleUrls: ['./table-user.component.css'],
})
export class TableUserComponent implements OnInit {
  
  userList: User[];

  fbUID : string = '';
  fbName : string = '';
  fbNick : string = '';
  fbEmail : string = '';

  config: any;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.config = {
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: 0
    }
  }

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
        this.userList = this.userList.filter(user => !user.isAdmin);
        //console.log(this.userList);
      });
  }


  pageChanged(event){
    this.config.currentPage = event;
  }
}
