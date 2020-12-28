import { Component, OnInit, Input } from '@angular/core';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';

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

  constructor(private ps: PublicationsService, private us: UserService) { }

  ngOnInit(): void {
    //this.userPublications$ = this.ps.getUserPublications(this.userR.uid);
    this.obtenerFollowers();
    this.obtenerFollowed();
    this.obtenerPublicaciones();
  }

  //Followers
  obtenerFollowers(){ //USUARIO DE GOOGLE NO TIENE UID
    this.us.getFollowersPerUser(this.userR.uid).subscribe(data => {
      this.followersList = data;
      //console.log(this.followersList);
    });
  }

  //Followed
  obtenerFollowed(){
    this.us.getFollowedPerUser(this.userR.uid).subscribe(data => {
      this.followedList = data;
      //console.log(this.followedList);
    });
  }

  //Publications
  obtenerPublicaciones(){
    this.ps.getUserPublications(this.userR.uid).subscribe(data => {
      this.publicationsList = data;
      //console.log(this.publicationsList);
    });
  }
}
