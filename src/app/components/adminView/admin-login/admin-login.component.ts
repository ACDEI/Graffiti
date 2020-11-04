import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent implements OnInit {

  constructor() { }

  wantRegister: boolean = false;

  ngOnInit(): void {
  }

  viewRegister(show : boolean){
    this.wantRegister = show;
  }

}
