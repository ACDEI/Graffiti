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
    this.route.params.subscribe(params => {
      this.us.getUser(params['uid']).then(user => { 
        this.user = user;

        var usuario = JSON.parse(window.sessionStorage.getItem("usuario"));
        this.uidUsuarioSesion = usuario.uid;
    
        if((this.user.uid) === (this.uidUsuarioSesion)){
         this.miPerfil = true; 
         //console.log("MI PERFIL");
        } else {
          this.miPerfil = false;
          //console.log("NO MI PERFIL");
        }

        this.obtenerPublicaciones();
        this.obtenerFollowedSesion();
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
    this.ps.deletePublicationCF(pid).subscribe();
  }

  //Likes
  obtenerLikes(){
    this.us.getLikesPerUser(this.user.uid).subscribe( data => {
      this.likesList = data;
    });
  }

  deleteLike(pid : string){
    this.us.deleteLikeFromUserCF(this.user.uid, pid).subscribe();
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
      if((this.user.uid) != (this.uidUsuarioSesion)) this.isMyFollowed();
      //console.log("FUNCION " + this.followedListSesion);
    });
  }

  isMyFollowed(){
    if(this.followedListSesion.length == 0){
      this.miSeguido = false;
      //console.log("NO TENGO SEGUIDOS");
    } else {
      if(this.followedListSesion.includes(this.user)){
        this.miSeguido = true;
        //console.log("LO SIGO");
      } else {
        this.miSeguido = false;
        console.log("NO LO SIGO");
      }
    }
  }

  postFollowed(uidF : string){
    //this.us.postFollowedPerUser(this.us);
  }

  deleteFollowed(uidF : string) {  //Dejar de seguir a alguien
    this.us.deleteFollowedPerUserCF(this.user.uid, uidF).subscribe();
  }

  followUser(uidF: string){

  }

  unfollowUser(uidF: string){

  }
}
