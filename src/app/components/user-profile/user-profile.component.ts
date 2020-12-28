import { Component, OnInit } from '@angular/core';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { AuthService } from '@core/services/auth.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  user: User;
  pubList: any[];

  constructor(private route: ActivatedRoute, private auth: AuthService, private userService: UserService, private pubService: PublicationsService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params =>{
      this.userService.getUser(params['uid']).subscribe(value => {
        this.user = value;
      });
    });

  }
}
