import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '@core/services/classes_services/user.service';

@Component({
  selector: 'app-card-user',
  templateUrl: './card-user.component.html',
  styleUrls: ['./card-user.component.css']
})
export class CardUserComponent implements OnInit {

  @Input() userR : User;

  constructor(private toastr : ToastrService, private userService: UserService) { }

  ngOnInit(): void {
  }

  deleteUser(uid: string){
    //this.userService.delete_User(uid);
    this.toastr.success("Eliminado Correctamente", "", {timeOut: 1000});
  }

}
