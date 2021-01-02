import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@core/services/classes_services/user.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.css']
})

export class CardUserComponent implements OnInit {

  @Input() userR : User;

  constructor(private toastr : ToastrService, private us: UserService, 
    private ps: PublicationsService) { }

  ngOnInit(): void {
    this.cambiarModal();
  }

  deleteUser(uid: string){
    this.us.deleteUsersCF(uid).subscribe(
      data => { this.toastr.success("Usuario Eliminado Correctamente", "", {timeOut: 1000}); },
      err => { this.toastr.error("Ups...", "Parece que ha habido un problema"
        + " al eliminar el usuario. Pruebe de nuevo.", {timeOut: 1000}); }
    );
  }

  cambiarModal(){
    var opModalButton = document.getElementsByClassName("btn btn-success ml-5 opM");
    var modalView = document.getElementsByClassName("modal fade opM");
    var hrefP0 = document.getElementsByClassName("pil0");
    var hrefP1 = document.getElementsByClassName("pil1");
    var hrefP2 = document.getElementsByClassName("pil2");
    var hrefP3 = document.getElementsByClassName("pil3");
    var mvPillowsM0 = document.getElementsByClassName("tab-pane fadeM0");
    var mvPillowsM1 = document.getElementsByClassName("tab-pane fadeM1");
    var mvPillowsM2 = document.getElementsByClassName("tab-pane fadeM2");
    var mvPillowsM3 = document.getElementsByClassName("tab-pane fadeM3");
    var c: any = 0;
    let isUnd: boolean = true;

    while(isUnd && c < opModalButton.length){
      if(opModalButton[c].getAttribute('data-target') === null){
        opModalButton[c].setAttribute('data-target', "#b" + c);
        modalView[c].setAttribute("id", 'b' + c);
        hrefP0[c].setAttribute("href", hrefP0[c].getAttribute('href') + c);
        hrefP1[c].setAttribute("href", hrefP1[c].getAttribute('href') + c);
        hrefP2[c].setAttribute("href", hrefP2[c].getAttribute('href') + c);
        hrefP3[c].setAttribute("href", hrefP3[c].getAttribute('href') + c);
        mvPillowsM0[c].setAttribute("id", mvPillowsM0[c].getAttribute('id') + c);
        mvPillowsM1[c].setAttribute("id", mvPillowsM1[c].getAttribute('id') + c);
        mvPillowsM2[c].setAttribute("id", mvPillowsM2[c].getAttribute('id') + c);
        mvPillowsM3[c].setAttribute("id", mvPillowsM3[c].getAttribute('id') + c);
        isUnd = false;
      }
      c++;
    }
  }

}
