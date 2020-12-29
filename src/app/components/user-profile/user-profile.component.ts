import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;

  pubList: any[]; //Publications
  followerList : any[]; //Followers
  followedList : any[]; //Followed
  likesList : any[];  //Likes

  constructor(private route: ActivatedRoute, private as: AuthService, 
    private us: UserService, private ps: PublicationsService) { 
    }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.us.getUser(params['uid']).then(user => { 
        this.user = user;
        this.obtenerPublicaciones();
      });
    });

    //this.pubList = [];
    this.followedList = [];
    this.followerList = [];
    this.likesList = [];
  }

  //Publicaciones
  obtenerPublicaciones(){
    this.ps.getUserPublications(this.user.uid).subscribe( 
      data => { this.pubList = data; }
    );
  }

  deletePublicacion(pid : string){
    this.ps.deletePublicacion(pid);
  }

  //Likes
  obtenerLikes(){
    this.us.getLikesPerUser(this.user.uid).subscribe( data => {
      this.likesList = data;
    });
  }

  deleteLike(pid : string){
    this.us.deleteLikeFromUser(this.user.uid, pid).subscribe();
  }

  //Followers
  obtenerFollowers(){
    this.us.getFollowersPerUser(this.user.uid).subscribe( data => {
      this.followerList = data;
    });
  }

  //Followed
  obtenerFollowed(){
    this.us.getFollowedPerUser(this.user.uid).subscribe( data => {
      this.followedList = data;
    });
  }

  postFollowed(uidF : string){
    //this.us.postFollowedPerUser(this.us);
  }

  deleteFollowed(uidF : string) {  //Dejar de seguir a alguien
    this.us.deleteFollowedPerUser(this.user.uid, uidF).subscribe();
  }
}
