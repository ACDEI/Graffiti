import { Component, Input, OnInit } from '@angular/core';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css']
})
export class PhotoCardComponent implements OnInit {

  @Input() pubR: Publication;

  themesList : Theme[];

  user$ : Observable<User>;  //User Uploader

  constructor(private publicationService: PublicationsService, private userService: UserService,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser(this.pubR.uid);   //No Funciona
    this.themeService.getAllThemes()
    .snapshotChanges()
    .pipe(
      map((changes) =>
        changes.map((c) => ({
          id: c.payload.doc.id,
          ...c.payload.doc.data(),
        }))
      )
    )
    .subscribe((data) => {
      this.themesList = data;
      //console.log(this.themesList);
    });
  }

  //antes de eliminar la publicacion de la collecion publications, hay que eliminar el pid de en el array publications de la collecion themes. (Para cada theme)
  deletePublication(pid: string){
    
  }

}
