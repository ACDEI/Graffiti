import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import {User} from '../../models/user.model';
import * as firebase from 'firebase';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  uid:string; 

  constructor(private route: ActivatedRoute, private authService: AuthService, private _data: User ) {
  

    var usuario= JSON.parse(window.sessionStorage.getItem("usuario"));

    this.uid = usuario.uid; 


  }
 
  ngOnInit(): void {

    
   /*
    this.route.params.subscribe(params => {
      this.uid = params.uid;
    })
 */
  }

  checkToken(){
    this.authService.checkTokenFacebook();
  }

   signOut(): void {
     this.uid = null;
     this.authService.userSelected = null; 
     this.authService.signOutFacebook();
  }

}
