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

  //Forms
  title : string;
  state : string;
  themes : string[];

  user$ : Observable<User>;  //User Uploader

  constructor(private ps: PublicationsService, private userService: UserService,
    private themeService: ThemeService) { }

  ngOnInit(): void {
    this.themes = this.pubR.themes;
    this.title = this.pubR.title;
    this.state = this.pubR.state;
    
    this.user$ = this.userService.getUser(this.pubR.uid);
    this.obtenerTematicas();
  }

  obtenerTematicas(){
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

  //Actualizar Modal
  selectThemes(){
    //Initialize Selected
    var sel = document.getElementById("sT_"+this.pubR.pid);
    var options = sel.getElementsByTagName('option');

    for(var i = 0; i < options.length; i++){
      if(this.themes.includes(options[i].getAttribute('value'))) {
        options[i].setAttribute("selected", 'true');
      }
    }
  }

  updatePublication(){
    let pub : any = {
      "title": this.title,
      "state": this.state,
      "themes": this.themes
    };
    this.ps.updateById(this.pubR.pid, pub).subscribe();
  }

  //Cambiar el Estado
  onChange(value){
    this.state = value;
  }

  onChangeTheme(value){

    this.themes = [];
    //console.log(value);

    var sel = document.getElementById("sT_" + this.pubR.pid);
    var options = sel.getElementsByTagName('option');
  
    for(var i = 0; i < options.length; i++){
      if(options[i].selected) this.themes.push(options[i].getAttribute('value'));
    }
    //console.log(this.themes);
  }
}
