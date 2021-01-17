import { Component, OnInit, Input } from '@angular/core';
import { Publication } from '@core/models/publication';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { TwitterService } from '@core/services/twitter.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.css']
})
export class CardPublicationComponent implements OnInit {

  @Input() pubR: Publication;

  user: any;
  likesList: any[];
  usuarioSesion: any;

  constructor(private us: UserService, private pb: PublicationsService,
    private ts : ToastrService, private tws :  TwitterService) { }

  ngOnInit(): void {
    this.us.getUser(this.pubR.uid).then(user => { this.user = user });
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    var uidUsuarioSesion = this.usuarioSesion.uid;
    this.us.getLikesPerUser(uidUsuarioSesion).subscribe(values => {
      this.likesList = values;
    });
  }

  isLiked(pid: string): boolean {
    if(this.likesList?.length != 0){
      return this.searchLikePhoto(pid);
    }
  }

  searchLikePhoto(pid: string): boolean {
    var encontrado: boolean = false;
    for(var i = 0; i < this.likesList?.length && !encontrado; i++){
      if(this.likesList[i]?.pid === pid){
        encontrado = true;
      }
    }
    return encontrado;
  }

  likePhoto(pid: string){
    var data = {
      "uid": this.usuarioSesion.uid,
      "nickName": this.usuarioSesion.nickName,
      "photoURL": this.usuarioSesion.photoURL
    };
    this.pb.postPublicationLikeCF(pid, data).then(data => { 
      this.ts.success("Favorito añadido correctamente", "", {timeOut: 1000});
    }).catch(err => { 
      this.ts.error("Ups...", "Ha Habido un problema al dar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

  unlikePhoto(pid: string){
    this.pb.deletePublicationLikeCF(this.usuarioSesion.uid, pid).then(data => { 
      this.ts.success("Favorito eliminado correctamente", "", {timeOut: 1000});
    }).catch(err => { 
      this.ts.error("Ups...", "Ha Habido un problema al eliminar Like." 
        + " Pruebe de nuevo", {timeOut: 1000}); }
    );
  }

  sendTweet(title: string ,url: string, lat: number, long: number){
    this.tws.sendTweet("Me ha gustado la publicación "+title+" #MalagArt @MalagArt_acdei",url,lat,long);
  }

}
