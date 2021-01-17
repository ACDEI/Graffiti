import { Component, Input, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { CommentsService } from '@core/services/comments.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css']
})
export class PhotoModalComponent implements OnInit {

  @Input() pubR: Publication;

  themesList : Theme[];
  commentsList : any[];
  likesList : any[];

  //Forms
  title : string;
  state : string;
  themes : string[];

  user$ : Observable<User>;  //User Uploader

  constructor(private ps: PublicationsService, private us: UserService,
    private themeService: ThemeService, private cs : CommentsService, 
    private ts : ToastrService) { }

  ngOnInit(): void {
    this.themes = this.pubR.themes;
    this.title = this.pubR.title;
    this.state = this.pubR.state;
    
    this.us.getUser(this.pubR.uid).then(user => { this.user$ = user });

    this.obtenerTematicas();
    this.obtenerComments();
    this.obtenerLikes();
  }

  //TEMATICAS
  obtenerTematicas(){
    this.themeService.getAllThemes()
    .snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }))
      )
    )
    .subscribe((data) => {
      this.themesList = data;
      //console.log(this.themesList);
    });
  }

  //COMENTARIOS
  obtenerComments(){
    this.cs.getCommentsByPublication(this.pubR.pid).subscribe(data => {
      this.commentsList = data;
      //console.log(this.commentsList);
    });
  }

  deleteComment(cid : any){
    this.cs.deleteComment(cid);
  }

  //LIKES
  obtenerLikes(){
    this.ps.getLikesByPublication(this.pubR.pid).subscribe(
      data => { this.likesList = data;},
      err => { this.ts.error('Algo ha fallado.', 'No se han podido obtener ' 
        + 'los likes de alguna publicación', {timeOut : 1000}) }
    );
  }

  deleteLikes(lid : any){
    //this.ps.deleteLikesCF(lid);
  }


  //Actualizar Modal
  selectThemes(){
    //Initialize Selected
    var sel = document.getElementById("sT_"+this.pubR.pid);
    var options = sel.getElementsByTagName('option');

    for(var i = 0; i < options.length; i++){
      if(this.themes.includes(options[i].getAttribute('value'))) {
        options[i].setAttribute("selected", 'true');
      }
    }
  }

  updatePublication(){
    let pub : any = {
      "title": this.title,
      "state": this.state,
      "themes": this.themes
    };
    this.ps.putPublicationCF(this.pubR.pid, pub).then( data => { 
      this.ts.success("Publicación Actualizada Correctamente", "", {timeOut: 1000});
    }).catch(err => { 
      this.ts.error("Ups...", "No se ha podido actualizar."
        + " Pruebe de nuevo más tarde", {timeOut: 1000});
    });
  }

  //Cambiar el Estado
  onChange(value){
    this.state = value;
  }

  onChangeTheme(value){

    this.themes = [];
    //console.log(value);

    var sel = document.getElementById("sT_" + this.pubR.pid);
    var options = sel.getElementsByTagName('option');
  
    for(var i = 0; i < options.length; i++){
      if(options[i].selected) this.themes.push(options[i].getAttribute('value'));
    }
    //console.log(this.themes);
  }
}
