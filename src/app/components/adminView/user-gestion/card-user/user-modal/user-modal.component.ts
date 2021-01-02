import { Component, OnInit, Input } from '@angular/core';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  @Input() userR: User;

  publicationsList: any[];
  followersList: any[];
  followedList: any[];

  constructor(private ps: PublicationsService, private us: UserService,
      private ts : ToastrService) { }

  ngOnInit(): void {
    //this.userPublications$ = this.ps.getUserPublications(this.userR.uid);
    this.obtenerFollowers();
    this.obtenerFollowed();
    this.obtenerPublicaciones();
  }

  //Followers
  obtenerFollowers(){ //USUARIO DE GOOGLE NO TIENE UID
    this.us.getFollowersPerUser(this.userR.uid).subscribe(
      data => { this.followersList = data; },
      err => { this.ts.error("Ups...", "Parece que ha habido un problema"
        + " al obtener los seguidores", {timeOut: 1000}); }
      );
  }

  //Followed
  obtenerFollowed(){
    this.us.getFollowedPerUser(this.userR.uid).subscribe(
      data => { this.followedList = data; },
      err => { this.ts.error("Ups...", "Parece que ha habido un problema"
        + " al obtener los seguidos", {timeOut: 1000}); }
    );
  }

  //Publications
  obtenerPublicaciones(){
    this.ps.getUserPublications(this.userR.uid).subscribe(
      data => { this.publicationsList = data; },
      err => { this.ts.error("Ups...", "Parece que ha habido un problema"
        + "al obtener las publicaciones", {timeOut: 1000}); }
    );
  }
}
