import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ScrollPaginationPublicationsService } from '@core/services/scroll-pagination-publications.service';
import { ToastrService } from 'ngx-toastr';
import { LocationService } from '@core/services/location.service';
import { MapService } from '@core/services/map.service';
import { WeatherService } from '@core/services/weather.service';
import { PublicationsService } from '@core/services/classes_services/publications.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stateList : string[] = ['Perfect', 'Legible', 'Illegible', 'Deteriorated'];
  themesList: any[];
  pubsPerPage = 6;
  isFilter: boolean;

  config: any = {
    itemsPerPage: this.pubsPerPage,
    currentPage: 1,
    totalItems: 0
  }

  publicationList: any;

  //Filters
  graffiter: string;
  theme: string;
  status: string;
  title: string;

  constructor(private locationService: LocationService, private mapService:MapService, 
    private themeService: ThemeService, private route: ActivatedRoute, 
    private ps : PublicationsService,
    private ts : ToastrService) {}
 
  ngOnInit(): void {
    
    this.resetAll();
    this.obtenerTematicas();

    this.locationService.getPosition().then( data => {
      this.mapService.buildMap(data.lng, data.lat, true);
    });
  }

  resetAll(){
    this.graffiter = '';
    this.status = '';
    this.theme = '';
    this.title = '';
    this.isFilter = false;
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
        && this.title.trim() === '' && this.graffiter.trim() === '') this.isFilter = false;//this.getPublications();
    else this.isFilter = true;
  }

  getPublications(){
    this.theme = '';
    this.status = '';
    this.title = '';
    this.graffiter = '';
    this.isFilter = false;
    this.ps.getAllPublications().subscribe((data) => { this.publicationList = data; });
  }

  pageChanged(event){
    this.config.currentPage = event;
  }

  clear(n : number) {
    if(n == 1) this.title = '';
    if(n == 2) this.graffiter = '';
    if(n == 3) this.theme = '';
    if(n == 4) this.status = '';

    if(this.title === '' && this.graffiter === '' 
        && this.theme === '' && this.status === '') this.isFilter = false;
    else this.isFilter = true;
  }

}
