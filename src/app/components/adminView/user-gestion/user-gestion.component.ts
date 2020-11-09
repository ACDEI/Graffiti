import { Component, OnInit } from '@angular/core';
import { UserService } from '@core/services/classes_services/user.service';

@Component({
  selector: 'app-user-gestion',
  templateUrl: './user-gestion.component.html',
  styleUrls: ['./user-gestion.component.css']
})
export class UserGestionComponent implements OnInit {

  constructor(private userService: UserService) { 
  }

  //@ViewChild(TableUserComponent) hijo: TableUserComponent;

  ngOnInit(): void {
    
  }

}
