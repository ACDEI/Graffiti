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
        
        this.miPerfil = this.user.uid === this.uidUsuarioSesion;

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
    });
  }

  isMyFollowed(){
    if(this.followedListSesion.length == 0){
      this.miSeguido = false;
    } else {
      this.miSeguido = this.searchUserInFollowedList(this.user.uid);
    }
  }

  loSigo(uidF: string): boolean{
    if(this.followedListSesion.length != 0){
      return this.searchUserInFollowedList(uidF)
    }
  }

  searchUserInFollowedList(uidF: string): boolean{
    var encontrado: boolean = false;
    for(var i = 0; i < this.followedListSesion.length && !encontrado; i++){
      if(this.followedListSesion[i].uid === uidF){
        encontrado = true;
      }
    }
    return encontrado;
  }

  soyYo(uidF): boolean {
    return uidF === this.uidUsuarioSesion;
  }

  followUser(uidF: string, imageF: string, nickF: string){
    var data = {
        "uid": uidF,
        "nick": nickF,
        "image": imageF
    };
    this.us.postFollowedPerUserCF(this.uidUsuarioSesion, data).subscribe();
  }

  unfollowUser(uidF: string){
    this.us.deleteFollowedPerUserCF(this.uidUsuarioSesion, uidF).subscribe();
  }
}
