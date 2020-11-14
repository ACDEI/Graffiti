import { Component, Input, OnInit } from '@angular/core';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
    private themeService: ThemeService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.user$ = this.userService.getUser(this.pubR.uid);
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


    this.cambiarModal();
    //console.log(this.pubR);
  }

  deletePublication(pid: string){
    this.publicationService.deletePublicacion(pid);
    this.toastr.success("Publicación Eliminada Correctamente", "", {timeOut: 1000});
  }

  cambiarModal(){

    //console.log("---------------- START ---------------------");
    var opModalButton = document.getElementsByClassName("btn btn-success ml-5 opM");
    var modalView = document.getElementsByClassName("modal fade opM");
    var c : any = 0;
    //console.log("OneB:" + opModalButton.length);
    //console.log("MV:" + modalView.length);

    let isUnd : boolean = true;

    while(isUnd && c < opModalButton.length){
      if(opModalButton[c].getAttribute('data-target') === null){
        opModalButton[c].setAttribute('data-target', "#a"+c);
        modalView[c].setAttribute("id", 'a'+c);
        console.log(c + ": " + this.pubR.pid);
        isUnd = false;
      }
      c++;
    }

  }

}
