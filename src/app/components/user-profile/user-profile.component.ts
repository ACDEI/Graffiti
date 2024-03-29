import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { ScrollPaginationService } from '@core/services/scroll-pagination.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  s : any;

  user: User;
  usuarioSesion: any;
  uidUsuarioSesion: string;
  miPerfil: boolean;
  miSeguido: boolean;

  pubList: any[]; //Publications
  followedListSesion: any[];
  likesList : any[];  //Likes
  followerList : any[]; //Followers
  followedList : any[]; //Followed
  //visitedList : any[]; //Visitados

  //Account Settings
  profile_fullname: string;
  profile_username: string;

  constructor(private route: ActivatedRoute, private as: AuthService, 
    private us: UserService, private ps: PublicationsService,
    private ts : ToastrService, private r: Router, 
    public pages : ScrollPaginationService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.us.getUser(params['uid']).then(user => { 
        this.user = user;

        this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
        this.uidUsuarioSesion = this.usuarioSesion.uid;
        
        this.miPerfil = this.user.uid === this.uidUsuarioSesion;

        this.cambiarPill();
        this.obtenerPublicaciones();
        this.obtenerFollowedSesion();
      });
      
    });

    //this.pubList = [];
    this.followedList = [];
    this.followerList = [];
    this.likesList = [];
  }

  ngOnDestroy(){
    this.s.unsubscribe();
  }

  saveChanges(){
    if((this.profile_fullname != null && this.profile_fullname.trim() !== "" && this.profile_fullname !== this.user.fullName) || 
        (this.profile_username != null && this.profile_username.trim() !== "" && this.profile_username !== this.user.nickName)) {
      if(this.profile_fullname == null || this.profile_fullname.trim() === "") this.profile_fullname = this.user.fullName;
      if(this.profile_username == null || this.profile_username.trim() === "") this.profile_username = this.user.nickName;
      var data : any = {
        "fullName" : this.profile_fullname,
        "nickName" : this.profile_username,
        "photoURL" : this.user.photoURL
      };
      this.us.putUsersCF(this.uidUsuarioSesion, data).then(success => {
        this.ts.success("Cambios realizados con Éxito.", "", {timeOut:1000});
        window.sessionStorage.removeItem("usuario");
        this.us.loginUser(data).then( user => {
          window.sessionStorage.setItem("usuario",JSON.stringify(user));
        });
      }).catch(err => {
        this.ts.error("Lo sentimos", "Ha habido un problema al " 
          + " guardar los cambios.", {timeOut:2000});
      });
      this.profile_fullname = "";
      this.profile_username = "";
    } else this.ts.warning("Atención", "No se han detectado cambios", {timeOut:2000});
  }

  scrollHandler(e) {
    if (e === 'bottom') {
      this.pages.more()
    }
  }

  deleteAccount(){
    this.us.deleteUsersCF(this.uidUsuarioSesion).then( data => {
      this.r.navigate([''])
    }).catch(err => {
      this.ts.error("Lo sentimos", "Ha habido un problema " 
        + " al eliminar su cuenta. Inténtelo más tarde.", {timeOut: 1500});
    });
  }

  //Publicaciones
  obtenerPublicaciones(){
    this.s = this.ps.getUserPublications(this.user.uid).subscribe( 
      data => { this.pubList = data; }
    );
  }

  deletePublicacion(pid : string){
    this.ps.deletePublicationCF(pid).then(data => { 
      this.ts.success("Publicación eliminada correctamente", "", {timeOut: 1000});
    }).catch(err => { 
      this.ts.error("Lo sentimos", "Ha Habido un problema al eliminar publicación.", {timeOut: 1000});
    });
  }

  //Likes
  obtenerLikes(){
    this.us.getLikesPerUser(this.user.uid).subscribe( data => {
      this.likesList = data;
    });
  }

  deleteLike(pid : string){
    this.us.deleteLikeFromUserCF(this.user.uid, pid).then( data => { 
      this.ts.success("Favorito eliminado correctamente", "", {timeOut: 1000});
    }).catch( err => { 
      this.ts.error("Ups...", "Ha Habido un problema al eliminar Like." 
        + " Pruebe de nuevo", {timeOut: 1000});
    });
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
    if(this.followedListSesion?.length == 0) { this.miSeguido = false; }
    else { this.miSeguido = this.searchUserInFollowedList(this.user.uid); }
  }

  loSigo(uidF: string): boolean{
    if(this.followedListSesion?.length != 0) {
      return this.searchUserInFollowedList(uidF)
    }
  }

  searchUserInFollowedList(uidF: string): boolean{
    var encontrado: boolean = false;
    for(var i = 0; i < this.followedListSesion?.length && !encontrado; i++){
      if(this.followedListSesion[i]?.uid === uidF){ encontrado = true; }
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
    this.us.postFollowedPerUserCF(this.uidUsuarioSesion, data).then( data => { 
      this.ts.info("Ahora sigues a " + nickF, "", {timeOut: 1000});
    }).catch( err => { 
      this.ts.error("Ups...", "Ha Habido un problema al seguir." 
        + " Pruebe de nuevo más tarde", {timeOut: 1000});
    });
  }

  unfollowUser(uidF: string, nickF : string){
    this.us.deleteFollowedPerUserCF(this.uidUsuarioSesion, uidF).then( data => { 
      this.ts.success("Ha dejado de seguir a " + nickF, "", {timeOut: 1000});
    }).catch( err => { 
      this.ts.error("Ups...", "Ha Habido un problema al dejar de seguir." 
        + " Pruebe de nuevo más tarde", {timeOut: 1000});
    });
  }

  //VISITADOS
  obtenerVisitados(){
    this.pages.reset()
    this.pages.init('users/' + this.user.uid + '/visitados', 'pid', { limit: 5, reverse: false, prepend: false });
    //this.us.getVisitadosPerUser(this.user.uid).subscribe( data => {
    //  this.visitedList = data;
    //});
  }

  cambiarPill(){

    //Poner Todas Sin Active
    var pillsBtn = document.getElementsByClassName('nl nav-link');
    var pillsShow = document.getElementsByClassName('tab-pane conf');
    for (var i = 0; i < pillsBtn.length; i++) {

      //Agregamos / Quitamos Clase
      var obj = pillsBtn.item(i);
      var id = obj.getAttribute('id');

      if( id === 'v-pills-myGraffitis-tab') obj.classList.add('active');
      else obj.classList.remove('active');

      //Mostramos / Ocultamos Panel
      var panel = pillsShow.item(i);
      var idP = panel.getAttribute('id');
      if(idP === 'v-pills-myGraffitis') panel.className += ' active show';
      else {
        panel.classList.remove('active');
        panel.classList.remove('show');
      }
    }
  }
}
