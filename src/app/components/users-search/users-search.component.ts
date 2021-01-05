import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '@core/services/classes_services/user.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css']
})
export class UsersSearchComponent implements OnInit {

  usersList: any[] = [];
  isFilter: boolean = false;
  twttr: any;

  //Forms
  fullName: string = '';
  nickName: string = '';

  constructor(private us: UserService) { }

  ngOnInit(): void {
    this.resetear();
    this.isFilter = false;
  }

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
  }

  applyFilter() {
    this.isFilter = true;
    this.us.getAllUsersNoAdminPerNickOrFull(this.nickName, this.fullName).then(res => {this.usersList = res});
  }

  resetear(){
    this.isFilter = false;
    this.us.getAllUsersNoAdminPerNickOrFull('', '').then(res => {this.usersList = res});
  }

}
