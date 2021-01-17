import { Component, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-table',
  templateUrl: './photo-table.component.html',
  styleUrls: ['./photo-table.component.css']
})
export class PhotoTableComponent implements OnInit {

  publicationList: Publication[];

  fbPID : string = '';
  fbTitle : string = '';
  fbGraffiter : string = '';
  fbState : string = '';

  config: any;

  constructor(private publicationService: PublicationsService) { }

  ngOnInit(): void {
    this.obtenerPublicaciones();
    this.config = {
      itemsPerPage: 8,
      currentPage: 1,
      totalItems: 0
    }
  }

  obtenerPublicaciones(): void {
    this.publicationService
      .getAllPublications()
      .subscribe((data) => {
        this.publicationList = data;
        //console.log(this.publicationList);
      });
  }

  pageChanged(event){
    this.config.currentPage = event;
  }


}
