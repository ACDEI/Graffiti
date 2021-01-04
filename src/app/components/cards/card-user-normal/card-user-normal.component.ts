import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/classes_services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-card-user-normal',
  templateUrl: './card-user-normal.component.html',
  styleUrls: ['./card-user-normal.component.css']
})
export class CardUserNormalComponent implements OnInit {
  
  usuarioSesion: any;
  @Input() userR: User;

  followedList: any[];

  constructor(private userService: UserService, private ts : ToastrService) { }

  ngOnInit(): void {
    this.usuarioSesion = JSON.parse(window.sessionStorage.getItem("usuario"));
    this.userService.getFollowedPerUserCF(this.usuarioSesion.uid).subscribe(values => {
      this.followedList = values;
    });
  }

  isMe(): boolean {
    return this.usuarioSesion.uid === this.userR.uid;
  }

  loSigo(): boolean{
    var encontrado: boolean = false;
    if(this.followedList?.length > 0){
      for(var i = 0; i < this.followedList?.length && !encontrado; i++){
        if(this.followedList[i]?.uid === this.userR.uid) {
          encontrado = true;
        }
      }
    }
    return encontrado;
  }

  followUser(){
    var data = {
        "uid": this.userR.uid,
        "nick": this.userR.nickName,
        "image": this.userR.photoURL
    };
    this.userService.postFollowedPerUserCF(this.usuarioSesion.uid, data).subscribe(
      data => { this.ts.info("Ahora sigues a " + this.userR.nickName, "", {timeOut: 1000}); },
      err => { this.ts.error("Ups...", "Ha Habido un problema al seguir." 
        + " Pruebe de nuevo más tarde", {timeOut: 1000}); }
    );
  }

  unfollowUser(){
    this.userService.deleteFollowedPerUserCF(this.usuarioSesion.uid, this.userR.uid).subscribe(
      data => { this.ts.success("Ha dejado de seguir a " + this.userR.uid, "", {timeOut: 1000}); },
      err => { this.ts.error("Ups...", "Ha Habido un problema al dejar de seguir." 
        + " Pruebe de nuevo más tarde", {timeOut: 1000}); }
    );
  }

}
