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


  uid:string; 

  constructor(private route: ActivatedRoute, private loginservice: LoginService ) {
   }
 
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      this.uid = params.uid;
    })
 
  }

   signOut(): void {
    firebase.auth().signOut; 
    this.uid = null; 
    
  }

}
