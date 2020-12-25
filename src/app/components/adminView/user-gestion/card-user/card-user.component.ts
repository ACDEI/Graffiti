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

  constructor(private toastr : ToastrService, private userService: UserService, private publicationService: PublicationsService) { }

  ngOnInit(): void {
    this.cambiarModal();
  }

  deleteUser(uid: string){
    //this.userService.deleteUser(uid);
    this.toastr.success("Usuario Eliminado Correctamente", "", {timeOut: 1000});
  }

  cambiarModal(){
    var opModalButton = document.getElementsByClassName("btn btn-success ml-5 opM");
    var modalView = document.getElementsByClassName("modal fade opM");
    var c: any = 0;
    let isUnd: boolean = true;

    while(isUnd && c < opModalButton.length){
      if(opModalButton[c].getAttribute('data-target') === null){
        opModalButton[c].setAttribute('data-target', "#b" + c);
        modalView[c].setAttribute("id", 'b' + c);
        isUnd = false;
      }
      c++;
    }
  }

}
