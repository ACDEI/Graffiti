import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { LoginService } from '@core/services/login.service';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  sub:any;
  uid:number; 

  constructor(private route: ActivatedRoute, private loginservice: LoginService ) {

    this.sub = this.route.params.subscribe(params => {
      this.uid = params.uid;
    })

   }
 
  ngOnInit(): void {
    
  }

   signOut(): void {
    firebase.auth().signOut; 
    this.uid = null; 
    
  }

}
