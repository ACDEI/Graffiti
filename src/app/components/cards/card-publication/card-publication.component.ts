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

  user: any;

  constructor(private us: UserService) { }

  ngOnInit(): void {
    this.us.getUser(this.pubR.uid).then(user => { this.user = user });
  }

}
