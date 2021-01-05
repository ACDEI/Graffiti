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
  likesSesion: any[];
  commentsSesion: any[];

  //Comments Things
  commentsList : any[];
  cText : string;

  //LikesThings
  hasLike : boolean = false;

  //Edit Form
  editTitle: string;
  editGraffiter: string;
  editState: string;

  constructor(private mapPubService: MapService, private route: ActivatedRoute, private ps: PublicationsService,
       private us: UserService, private cs : CommentsService, private as : AuthService,
       private ts : ToastrService, private r: Router) { }

  ngOnInit(): void {

    //Cargar Usuario y Publicacion
    this.route.params.subscribe(params => {
      this.ps.getPublication(params['pid']).then(value => {
        this.pub = value;
        this.us.getUser(this.pub.uid).then(user => { this.user = user });
        this.pubThemes = this.pub.themes;
        
        this.mapPubService.buildMap(this.pub.coordinates.longitude, this.pub.coordinates.latitude, true);
        this.mapPubService.showPoint(this.pub);

        //Cargar Elementos
        this.obtenerComments();
      });
    });
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.us.getLikesPerUserCF(this.usuarioSesion.uid).subscribe(values => {
      this.likesSesion = values;
    });
    this.ps.getPublicationsByUserUidCF(this.usuarioSesion.uid).subscribe(values => {
      this.publicacionesSesion = values;
    });
    this.cs.getCommentsPerUserCF(this.usuarioSesion.uid).subscribe(values => {
      this.commentsSesion = values;
    });
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
    for (let i = 0; i < 15; i++) {
        cid += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return cid;
  }

  miComentario(cid: string): boolean {
    var encontrado: boolean = false;
    if(this.commentsSesion?.length > 0){
      for(var i = 0; i < this.commentsSesion?.length && !encontrado; i++){
        if(this.commentsSesion[i]?.cid === cid){
          encontrado = true;
        }
      }
    }
    return encontrado;
  }

  deleteComment(cid : string){
    this.cs.deleteComment(cid);
  }

  miPublicacion(): boolean {
    var encontrada: boolean = false;
    if(this.publicacionesSesion?.length > 0){
      for(var i = 0; i < this.publicacionesSesion?.length && !encontrada; i++){
        if(this.publicacionesSesion[i]?.uid === this.usuarioSesion.uid){
          encontrada = true;
        }
      }
    }
    return encontrada;
  }

  deletePublication(){
    this.ps.deletePublicationCF(this.pub.pid).subscribe();
    this.r.navigate(['home']);
  }

  saveChanges() {
    if((this.editTitle !== "" && this.editTitle != null) || (this.editGraffiter !== "" && this.editGraffiter != null) || (this.editState !== "" && this.editState != null)){
      if(this.editTitle == null || this.editTitle === "") this.editTitle = this.pub.title;
      if(this.editGraffiter == null || this.editGraffiter === "") this.editGraffiter = this.pub.graffiter;
      if(this.editState == null || this.editState === "") this.editState = this.pub.state;

      var data: any = {
        "title": this.editTitle,
        "graffiter": this.editGraffiter,
        "state": this.editState
      };
      this.ps.putPublicationCF(this.pub.pid, data).subscribe(
        success => {this.ts.success("Cambios realizados correctamente", "", {timeOut:1000});},
        err => {this.ts.error("Lo sentimos", "No se han podido guardar los cambios", {timeOut:2000});}
      );
      this.editTitle = "";
      this.editGraffiter = "";
    }
  }

  //Likes
  //Mirar si la publicacion esta dentro de los likes
  isLiked(): boolean{
    var encontrada: boolean = false;
    if(this.likesSesion?.length > 0) {
      for(var i = 0; i < this.likesSesion?.length && !encontrada; i++){
        if(this.likesSesion[i]?.pid === this.pub.pid){
          encontrada = true;
        }
      }
    }
    return encontrada;
  }

  likePhoto(){
    var data = {
      "uid": this.usuarioSesion.uid,
      "nickName": this.usuarioSesion.nickName,
      "photoURL": this.usuarioSesion.photoURL
    };
    this.ps.postPublicationLikeCF(this.pub.pid, data).subscribe(
      data => { this.ts.success("Favorito añadido correctamente", "", {timeOut: 1000}); },
      err => { this.ts.error("Ups...", "Ha Habido un problema al dar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

  unlikePhoto(){
    this.ps.deletePublicationLikeCF(this.usuarioSesion.uid, this.pub.pid).subscribe(
      data => { this.ts.success("Favorito eliminado correctamente", "", {timeOut: 1000}); },
      err => { this.ts.error("Ups...", "Ha Habido un problema al eliminar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

}
