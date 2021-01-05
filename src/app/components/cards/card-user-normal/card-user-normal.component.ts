import { Component, Input, OnInit } from '@angular/core';
import { User } from '@core/models/user.model';

@Component({
  selector: 'app-card-user-normal',
  templateUrl: './card-user-normal.component.html',
  styleUrls: ['./card-user-normal.component.css']
})
export class CardUserNormalComponent implements OnInit {
  
  @Input() userR: User;

  constructor() { }

  ngOnInit(): void {

  }
}
