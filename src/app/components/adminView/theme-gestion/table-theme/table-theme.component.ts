import { Component, OnInit } from '@angular/core';
import { Theme } from '@core/models/theme.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-table-theme',
  templateUrl: './table-theme.component.html',
  styleUrls: ['./table-theme.component.css']
})
export class TableThemeComponent implements OnInit {

  themesList : Theme[];
  fbName: string = '';
  config: any;
  fbNew: string = '';

  constructor(private toastr : ToastrService, private themeService: ThemeService, private pubService: PublicationsService) { }

  ngOnInit(): void {
    this.obtenerThemes();
    this.config = {
      itemsPerPage: 6,
      currentPage: 1,
      totalItems: 0
    }
  }

  obtenerThemes() : void {
    this.themeService
    .getAllThemes()
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

  pageChanged(event){
    this.config.currentPage = event;
  }

  deleteTheme(tid: string){
    this.themeService.deleteThemeByTidFC(tid).then(data => { 
      this.toastr.success("Temática Eliminada Correctamente", "", {timeOut: 1000}); 
    }).catch(err => { 
      this.toastr.error("Ups...", "No se ha podido eliminar la temática", {timeOut: 1000}); 
    });
  }

  addTheme(){
    const theme: any = {name: this.fbNew};
    this.themeService.createTheme(theme);
    this.fbNew = '';
    this.toastr.success("Añadido Correctamente", "", {timeOut: 1000});
  }

}
