import { templateJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-publication-view',
  templateUrl: './publication-view.component.html',
  styleUrls: ['./publication-view.component.css']
})
export class PublicationViewComponent implements OnInit {

  pub: Publication;
  user: User;
  pubThemes: string[];

  constructor(private route: ActivatedRoute, private pubService: PublicationsService, private userService: UserService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.pubService.getPublication(params['pid']).subscribe(value => {
        this.pub = value;
        this.userService.getUser(this.pub.uid).subscribe(u => {
          this.user = u;
        });
        this.pubThemes = this.pub.themes;
      });
    });
  }

}
