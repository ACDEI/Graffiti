import { Component, OnInit, Input } from '@angular/core';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})
export class UserModalComponent implements OnInit {

  @Input() userR: User;

  userPublications$: Observable<any[]>
  userFollowers$: Observable<User[]>
  userFollowed$: Observable<User[]>

  constructor(private publicationService: PublicationsService, private userService: UserService) { }

  ngOnInit(): void {
    //this.userPublications$ = this.publicationService.getUserPublications(this.userR.uid);
  }

}
