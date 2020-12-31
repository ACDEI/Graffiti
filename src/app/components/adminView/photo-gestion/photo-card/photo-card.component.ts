import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Publication } from '@core/models/publication';
import { Theme } from '@core/models/theme.model';
import { User } from '@core/models/user.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { UserService } from '@core/services/classes_services/user.service';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { PhotoModalComponent } from './photo-modal/photo-modal.component';

@Component({
  selector: 'app-photo-card',
  templateUrl: './photo-card.component.html',
  styleUrls: ['./photo-card.component.css']
})
export class PhotoCardComponent implements OnInit {

  @Input() pubR: Publication;
  @ViewChild(PhotoModalComponent) modal : PhotoModalComponent //View Modal Methods

  themesList : Theme[];
  selectedThemes : any[];

  user$ : Observable<User>;  //User Uploader

  constructor(private publicationService: PublicationsService, private us: UserService,
    private ts: ThemeService, private toastr : ToastrService) { }

  ngOnInit(): void {
    this.us.getUser(this.pubR.uid).then(user => { this.user$ = user });
    this.selectedThemes = this.pubR.themes;

    this.cambiarModal();
    //console.log(this.pubR);
  }

  deletePublication(pid: string){
    this.publicationService.deletePublicationCF(pid).subscribe(
      data => { this.toastr.success("Publicación Eliminada Correctamente", "", {timeOut: 1000}); },
      err => { this.toastr.error("Ups...", "Parece que ha habido un problema", {timeOut: 1000}); }
    );
  }

  cambiarModal(){

    //console.log("---------------- START ---------------------");
    var opModalButton = document.getElementsByClassName("btn btn-success ml-5 opM");
    var modalView = document.getElementsByClassName("modal fade opM");
    var hrefP0 = document.getElementsByClassName("pil0");
    var hrefP1 = document.getElementsByClassName("pil1");
    var hrefP2 = document.getElementsByClassName("pil2");
    var mvPillowsM0 = document.getElementsByClassName("tab-pane fadeM0");
    var mvPillowsM1 = document.getElementsByClassName("tab-pane fadeM1");
    var mvPillowsM2 = document.getElementsByClassName("tab-pane fadeM2");
    //var mvConfM = document.getElementsByClassName("confM");
    var c : any = 0;
    //console.log("OneB:" + opModalButton.length);
    //console.log("MV:" + modalView.length);

    let isUnd : boolean = true;

    while(isUnd && c < opModalButton.length){
      if(opModalButton[c].getAttribute('data-target') === null){
        opModalButton[c].setAttribute('data-target', "#a"+c);
        modalView[c].setAttribute("id", 'a'+c);
        hrefP0[c].setAttribute("href", hrefP0[c].getAttribute('href') + c);
        hrefP1[c].setAttribute("href", hrefP1[c].getAttribute('href') + c);
        hrefP2[c].setAttribute("href", hrefP2[c].getAttribute('href') + c);
        mvPillowsM0[c].setAttribute("id", mvPillowsM0[c].getAttribute('id') + c);
        mvPillowsM1[c].setAttribute("id", mvPillowsM1[c].getAttribute('id') + c);
        mvPillowsM2[c].setAttribute("id", mvPillowsM2[c].getAttribute('id') + c);
        //mvConfM[c].setAttribute("id", mvConfM[c].getAttribute('id') + c);
        //console.log(c + ": " + this.pubR.pid);
        isUnd = false;
      }
      c++;
    }

  }

  openModal(){
    this.modal.selectThemes();
  }

}
