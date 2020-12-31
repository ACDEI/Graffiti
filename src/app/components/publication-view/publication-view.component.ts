import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { CommentsService } from '@core/services/comments.service';

@Component({
  selector: 'app-publication-view',
  templateUrl: './publication-view.component.html',
  styleUrls: ['./publication-view.component.css']
})
export class PublicationViewComponent implements OnInit {

  pub: Publication;
  user: User;
  pubThemes: string[];

  //Comments Things
  commentsList : any[];
  cText : string;

  //LikesThings
  hasLike : boolean = false;

  constructor(private route: ActivatedRoute, private ps: PublicationsService,
       private us: UserService, private cs : CommentsService, private as : AuthService) { 
       }

  ngOnInit(): void {

    //Cargar Usuario y Publicacion
    this.route.params.subscribe(params => {
      this.ps.getPublication(params['pid']).then(value => {
        this.pub = value;
        this.us.getUser(this.pub.uid).then(user => { this.user = user });
        this.pubThemes = this.pub.themes;
        
        //Cargar Elementos
        this.obtenerComments();
      });
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
      uid : this.as.userSelected.uid,
      text : this.cText,
      image : this.as.userSelected.photoURL
    }
    this.cs.postCommentCF(comment).subscribe();
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

  deleteComment(cid : string){
    this.cs.deleteComment(cid);
  }

  //Likes
  postLike(){
    let user : any = this.as.userSelected;
    this.ps.postPublicationLikeCF(this.pub.pid, user).subscribe(
      data => this.hasLike = true,
      err => this.hasLike = false
    );
  }

  deleteLike(){
    let uid : any = this.as.userSelected.uid;
    this.ps.deletePublicationLikeCF(uid, this.pub.pid).subscribe(
      data => this.hasLike = false,
      err => this.hasLike = true
    );

  }

}
