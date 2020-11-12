import { Component, OnInit } from '@angular/core';
import { Theme } from '@core/models/theme.model';
import { PublicationsService } from '@core/services/classes_services/publications.service';
import { ThemeService } from '@core/services/classes_services/theme.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-theme-gestion',
  templateUrl: './theme-gestion.component.html',
  styleUrls: ['./theme-gestion.component.css']
})
export class ThemeGestionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
