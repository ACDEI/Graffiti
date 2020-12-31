import { Component, OnInit, Input } from '@angular/core';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-publication-profile',
  templateUrl: './card-publication-profile.component.html',
  styleUrls: ['./card-publication-profile.component.css']
})
export class CardPublicationProfileComponent implements OnInit {

  @Input() pubR: any;

  user: any;
  likesList: any[];
  usuarioSesion: any;

  constructor(private us: UserService, private pb: PublicationsService) { }

  ngOnInit(): void {
    this.us.getUser(this.pubR.upl_uid).then(user => { this.user = user });
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    var uidUsuarioSesion = this.usuarioSesion.uid;
    this.us.getLikesPerUser(uidUsuarioSesion).subscribe(values => {
      this.likesList = values;
    });
  }

  isLiked(pid: string): boolean {
    if(this.likesList.length != 0){
      return this.searchLikePhoto(pid);
    }
  }

  searchLikePhoto(pid: string): boolean {
    var encontrado: boolean = false;
    for(var i = 0; i < this.likesList.length && !encontrado; i++){
      if(this.likesList[i].pid === pid){
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
    this.pb.postPublicationLikeCF(pid, data).subscribe();
  }

  unlikePhoto(pid: string){
    this.pb.deletePublicationLikeCF(this.usuarioSesion.uid, pid).subscribe();
  }

}
