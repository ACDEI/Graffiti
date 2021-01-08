import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ScrollPaginationPublicationsService } from '@core/services/scroll-pagination-publications.service';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '@core/services/location.service';
import { MapService } from '@core/services/map.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stateList : string[] = ['Perfect', 'Legible', 'Illegible', 'Deteriorated'];
  themesList: any[];
  pubsPerPage = 12;
  isFilter: boolean; 
  loadAll: boolean;

  config: any = {
    itemsPerPage: this.pubsPerPage,
    currentPage: 1,
    totalItems: 0
  }

  //Form
  graffiter: string;
  theme: string;
  status: string;
  title: string;

  uid:string;
  //Tokens flickr
  oauth_token:string;
  oauth_verifier:string; 
  //token firebase
  token:string; 

  constructor(private locationService: LocationService, private mapService:MapService, 
    private themeService: ThemeService, private route: ActivatedRoute, 
    public page : ScrollPaginationPublicationsService, private ts : ToastrService) {}
 
  ngOnInit(): void {
    
    this.resetAll();
    this.obtenerTematicas();

    this.locationService.getPosition().then( data => {
      this.mapService.buildMap(data.lng, data.lat, true);
    })
  }

  resetAll(){
    this.graffiter = '';
    this.status = '';
    this.theme = '';
    this.title = '';
    this.isFilter = false;
    this.loadAll = false;
    this.getPublications();
    
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
    });
  }

  onChange(event?){

    if(this.theme.trim() === '' && this.status.trim() === ''
        && this.title.trim() === '' && this.graffiter.trim() === '') this.getPublications();
    else {
      let opts : any = {
        limit : this.pubsPerPage,
        prepend : false,
        reverse : false
      }
      if(this.theme != null && this.theme !== '') opts = { ...opts, themes : [this.theme]}
      if(this.status != null && this.status !== '') opts = { ...opts, state : this.status}
      if(this.title != null && this.title !== '') opts = { ...opts, title : this.title}
      if(this.graffiter != null && this.graffiter !== '') opts = { ...opts, graffiter : this.graffiter}
      this.page.reset();
      this.page.init('publications', 'date', {...opts});
      this.isFilter = true;
      this.loadAll = false;
    }
  }

  getPublications(){
    this.theme = '';
    this.status = '';
    this.title = '';
    this.graffiter = '';
    let opts : any = {
      limit : this.pubsPerPage,
      prepend : false,
      reverse : true
    }
    this.isFilter = false;
    this.loadAll = false;
    this.page.reset();
    this.page.init('publications', 'date', {...opts});
  }

  loadMore(){
    var prev : any, post : any;
    this.page.more();

    prev = this.page.sizePrev;
    post = this.page.sizePost;

    if(prev === post) {
      this.loadAll = true;
      this.ts.info('Parece que no hay más que ver... ¡Anímate a subir algo!', '', {timeOut: 1000}); 
    }
  }

  clear(n : number) {
    if(n == 1) this.title = '';
    if(n == 2) this.graffiter = '';
    if(n == 3) this.theme = '';
    if(n == 4) this.status = '';

    if(this.title === '' && this.graffiter === '' 
        && this.theme === '' && this.status === '') this.getPublications()
    else this.onChange();
  }

}
