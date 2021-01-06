import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserService } from '@core/services/classes_services/user.service';
import { ScrollPaginationUsersSearchService } from '@core/services/scroll-pagination-users-search.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html',
  styleUrls: ['./users-search.component.css'],
})
export class UsersSearchComponent implements OnInit {

  loadAll: boolean = false;
  isFilter: boolean = false;
  pubsPerPage = 9;
  twttr: any;

  //Forms
  fullName: string = '';
  nickName: string = '';

  constructor(private us: UserService, 
      public usersList : ScrollPaginationUsersSearchService,
      private ts : ToastrService) { }

  ngOnInit(): void {
    this.resetear();
    this.isFilter = false;
  }

  ngAfterViewInit(): void {
    (<any>window).twttr.widgets.load();
  }

  /* PAGINACION
  applyFilter() {
    this.isFilter = true;
    this.us.getAllUsersNoAdminPerNickOrFull(this.nickName, this.fullName).then(res => {this.usersList = res});
  }

  resetear(){
    this.isFilter = false;
    this.us.getAllUsersNoAdminPerNickOrFull('', '').then(res => {this.usersList = res});
  }
  */

  //SCROLL

  applyFilter(event?){
    if(this.nickName.trim() === '' && this.fullName.trim() === '') this.resetear();
    else {
      let opts : any = {
        limit : this.pubsPerPage,
        prepend : false,
        reverse : false
      }
      if(this.nickName != null && this.nickName !== '') opts = { ...opts, nick : this.nickName}
      if(this.fullName != null && this.fullName !== '') opts = { ...opts, name : this.fullName}

      this.usersList.reset();
      this.usersList.init('users', 'nickName', {...opts});
      this.isFilter = true;
    }
    this.loadAll = false;
  }

  resetear(){
    let opts : any = {
      limit : this.pubsPerPage,
      prepend : false,
      reverse : false
    }
    this.usersList.reset();
    this.usersList.init('users', 'nickName', {...opts});
    this.isFilter = false;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {

    var prev : any, post : any;
    this.usersList.data.subscribe(l => { prev = l.length; });
  
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)
      this.usersList.more();

    this.usersList.data.subscribe(l => { post = l.length; });
    if(prev == post && !this.loadAll) {
      this.ts.info('Parece que no hay más que ver...', '', {timeOut: 1000});
      this.loadAll = true;
    } 

  }

}
