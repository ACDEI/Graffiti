import { Component, Input, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-photo-modal',
  templateUrl: './photo-modal.component.html',
  styleUrls: ['./photo-modal.component.css']
})
export class PhotoModalComponent implements OnInit {

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
  //Método del Padre
  selectThemes(){
    //Initialize Selected
    var sel = document.getElementById("sT_"+this.pubR.pid);
    var options = sel.getElementsByTagName('option');

    for(var i = 0; i < options.length; i++){
      if(this.pubR.themes.includes(options[i].getAttribute('value'))) {
        options[i].setAttribute("selected", 'true');
      }
    }
  }
}
