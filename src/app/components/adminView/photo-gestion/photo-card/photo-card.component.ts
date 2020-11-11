import { Component, Input, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css']
})
export class PhotoCardComponent implements OnInit {

  @Input() pubR: Publication;

  constructor(private publicationService: PublicationsService) { }

  ngOnInit(): void {
  }

  //antes de eliminar la publicacion de la collecion publications, hay que eliminar el pid de en el array publications de la collecion themes. (Para cada theme)
  deletePublication(pid: string){
    
  }

}
