import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { CommentsService } from '@core/services/comments.service';
import { MapService } from '@core/services/map.service';
import { ToastrService } from 'ngx-toastr';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-publication-view',
  templateUrl: './publication-view.component.html',
  styleUrls: ['./publication-view.component.css']
})
export class PublicationViewComponent implements OnInit {

  pub: Publication;
  user: User;
  pubThemes: string[];
  usuarioSesion : any;
  publicacionesSesion: any[];
  commentsSesion: any[];
  miPublicacion: boolean;
  stateList : string[] = ['Perfect', 'Legible', 'Illegible', 'Deteriorated'];

  //Comments Things
  commentsList : any[];
  cText : string;

  //LikesThings
  hasLike : boolean = false;

  //Edit Form
  editTitle: string;
  editGraffiter: string;
  editState: string;
  editThemes: string[];

  themesSettings : IDropdownSettings = {
    enableCheckAll: false,
    allowSearchFilter: true,
    limitSelection: 3,
    searchPlaceholderText: 'Buscar por Nombre',
    textField: 'name',
    defaultOpen: false
  };

  constructor(private mapPubService: MapService, private route: ActivatedRoute, private ps: PublicationsService,
       private us: UserService, private cs : CommentsService, private as : AuthService,
       private ts : ToastrService, private r: Router) { }

  ngOnInit(): void {
    //Cargar Usuario y Publicacion
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.route.params.subscribe(params => {
      this.ps.getPublication(params['pid']).then(value => {
        
        this.pub = value;
        this.us.getUser(this.pub.uid).then(user => { this.user = user });
        this.pubThemes = this.pub.themes;
        this.editThemes = this.pubThemes;
        this.isLiked();
        this.miPublicacion = this.usuarioSesion.uid === this.pub.uid;

        this.editState = this.pub.state;
        
        this.mapPubService.buildMap(this.pub.coordinates.longitude, this.pub.coordinates.latitude, true);
        this.mapPubService.showPoint(this.pub);

        //Cargar Elementos
        this.obtenerComments();
      });
    });
  }

  onChange(){
    console.log(this.editState);
  }

  //Comments
  obtenerComments(){
    this.cs.getCommentsByPublication(this.pub.pid).subscribe(data => {
      this.commentsList = data;
      //console.log(this.commentsList);
    });
  }

  postComment(){
    let comment : any = {
      cid : this.generateCID(),
      pid : this.pub.pid,
      uid : this.usuarioSesion.uid,
      text : this.cText,
      nick : this.usuarioSesion.nickName,
      image : this.usuarioSesion.photoURL
    }

    this.cs.postCommentCF(comment).subscribe(
      data => { this.ts.success("Comentario publicado correctamente", "", {timeOut: 1000}); },
      err => { this.ts.error("Ups...", "Ha Habido un problema al publicar el comentario." 
        + " Recargue y pruebe de nuevo", {timeOut: 1000}); }
    );
  }

  generateCID(){
    var cid : string = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 24; i++) {
        cid += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return cid;
  }

  miComentario(uid: string): boolean {
    return this.usuarioSesion.uid === uid;
  }

  deleteComment(cid : string){
    this.cs.deleteComment(cid);
  }

  deletePublication(){
    this.ps.deletePublicationCF(this.pub.pid).subscribe();
    this.r.navigate(['home']);
  }

  saveChanges() {
    if(
      this.validateTitle() || 
      this.validateGraffiter || 
      this.validateState() ||
      this.validateThemes()
      ){

      if(this.emptyTitle()) this.editTitle = this.pub.title;
      if(this.emptyGraffiter()) this.editGraffiter = this.pub.graffiter;

      var data: any = {
        "title": this.editTitle,
        "graffiter": this.editGraffiter,
        "state": this.editState,
        "themes": this.editThemes
      };
      this.ps.putPublicationCF(this.pub.pid, data).subscribe(
        success => {this.ts.success("Cambios realizados correctamente", "", {timeOut:1000});},
        err => {this.ts.error("Lo sentimos", "No se han podido guardar los cambios", {timeOut:2000});}
      );
      this.editTitle = "";
      this.editGraffiter = "";
      this.editThemes = [];
    } else {
      this.ts.warning("Atención", "No se han detectado cambios", {timeOut:2000});
    }
  }

  validateTitle(): boolean {
    return this.editTitle != null && 
           this.editTitle.trim() !== "" && 
           this.editTitle !== this.pub.title;
  }

  validateGraffiter(): boolean {
    return this.editGraffiter != null && 
           this.editGraffiter.trim() !== "" && 
           this.editGraffiter !== this.pub.graffiter;
  }

  validateState(): boolean {
    return this.editState !== this.pub.state;
  }

  validateThemes(): boolean {
    return this.editThemes != null &&
           this.editThemes != [] &&
           (
             this.editThemes.length != this.pubThemes.length ||
             (
               this.editThemes.length == this.pubThemes.length &&
               this.differentThemes()
             )
           );
  }

  differentThemes(): boolean {
    var iguales: boolean = false;

    for(var i = 0; i < this.editThemes.length && !iguales; i++) {
      if(this.pubThemes.includes(this.editThemes[i])) {
        iguales = true;
      }
    }

    return iguales;
  }

  emptyTitle(): boolean {
    return this.editTitle == null || 
           this.editTitle.trim() === "";
  }

  emptyGraffiter(): boolean {
    return this.editGraffiter == null || 
           this.editGraffiter.trim() === "";
  }

  //Likes
  //Mirar si la publicacion esta dentro de los likes
  isLiked() {
   this.us.isLikeFromUser(this.usuarioSesion.uid, this.pub.pid).then( l => {this.hasLike = l});
  }

  likePhoto(){
    var data = {
      "uid": this.usuarioSesion.uid,
      "nickName": this.usuarioSesion.nickName,
      "photoURL": this.usuarioSesion.photoURL
    };
    this.ps.postPublicationLikeCF(this.pub.pid, data).subscribe(
      data => { 
        this.ts.success("Favorito añadido correctamente", "", {timeOut: 1000}); 
        this.hasLike = true; 
      },
      err => { this.ts.error("Ups...", "Ha Habido un problema al dar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

  unlikePhoto(){
    this.ps.deletePublicationLikeCF(this.usuarioSesion.uid, this.pub.pid).subscribe(
      data => { 
        this.ts.success("Favorito eliminado correctamente", "", {timeOut: 1000}); 
        this.hasLike = false;
      },
      err => { this.ts.error("Ups...", "Ha Habido un problema al eliminar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

}
