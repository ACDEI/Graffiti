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
  uidUsuarioSesion: string;
  miPerfil: boolean;
  miSeguido: boolean;

  pubList: any[]; //Publications
  followerList : any[]; //Followers
  followedList : any[]; //Followed
  followedListSesion: any[];
  likesList : any[];  //Likes

  constructor(private route: ActivatedRoute, private as: AuthService, 
    private us: UserService, private ps: PublicationsService) { 
    }

  ngOnInit(): void {
    var usuario = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.uidUsuarioSesion = usuario.uid;
    this.route.params.subscribe(params => {
      this.us.getUser(params['uid']).then(user => { 
        this.user = user;
        if((this.user.uid) === (this.uidUsuarioSesion)) this.miPerfil = true;
        else this.miPerfil = false;
        this.obtenerPublicaciones();
        this.obtenerFollowedSesion();
        this.isMyFollowed();
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

  obtenerFollowedSesion(){
    this.us.getFollowedPerUser(this.uidUsuarioSesion).subscribe(data => {
      this.followedListSesion = data;
    });
  }

  isMyFollowed(){
    var length: number = this.followedListSesion.length;
    if(length == 0){
      this.miSeguido = false;
    } else {
      if(this.followedListSesion.includes(this.user)){
        this.miSeguido = true;
      } else {
        this.miSeguido = false;
      }
    }
  }

  postFollowed(uidF : string){
    //this.us.postFollowedPerUser(this.us);
  }

  deleteFollowed(uidF : string) {  //Dejar de seguir a alguien
    this.us.deleteFollowedPerUser(this.user.uid, uidF).subscribe();
  }

  followUser(uidF: string){

  }

  unfollowUser(uidF: string){

  }
}
