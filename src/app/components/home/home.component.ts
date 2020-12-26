import { Component, OnInit } from '@angular/core';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import { Publication } from '@core/models/publication';
import { Theme } from '../../models/theme.model';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  publicationsList: any[];
  themesList: any[];

  //Form
  graffiter: string;
  theme: string;
  status: string;

  uid:string;
  isFilter: boolean; 

  constructor(private pubService: PublicationsService, private themeService: ThemeService) { }
 
  ngOnInit(): void {
    this.isFilter = false;
    this.resetear();

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
      console.log(this.themesList);
    });
  }

  getByStatus(){
    
  }

  getByTheme(){
    this.pubService.getPublicationsByTheme(this.theme).subscribe(value => {
      this.publicationsList = value;
      this.isFilter = true;
    });
  }

  getByGraffiter(){
    this.pubService.getPublicationsByGraffiterName(this.graffiter).subscribe(value => {
      this.publicationsList = value;
      this.isFilter = true;
    });
  }

  resetear(){
    this.pubService.getAllPublications()
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
      this.publicationsList = data;
      this.isFilter = false
      this.graffiter = "";
      console.log(this.publicationsList);
    });
  }

}
