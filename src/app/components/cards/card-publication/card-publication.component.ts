import { Component, OnInit, Input } from '@angular/core';
import { Publication } from '@core/models/publication';
import { User } from '@core/models/user.model';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-card-publication',
  templateUrl: './card-publication.component.html',
  styleUrls: ['./card-publication.component.css']
})
export class CardPublicationComponent implements OnInit {

  @Input() pubR: Publication;

  user$: Observable<User>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser(this.pubR.uid);
  }

}
