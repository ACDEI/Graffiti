import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

//Adicionales
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

//Routes
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore, AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from '../environments/environment';

//Clases - Models
import {User} from './models/user.model';

//Pipes
import { FilterUserAdminPipe } from './pipes/filterUserAdmin.pipe'
import { FilterPublicationAdminPipe } from './pipes/filterPublicationAdmin.pipe'
import { FilterThemeAdminPipe } from './pipes/filterThemeAdmin.pipe'
import { Browser } from 'protractor';

//Services
import { AuthService } from './services/auth.service';
import { UserService } from './services/classes_services/user.service';
import { PublicationsService } from './services/classes_services/publications.service';
import { ThemeService } from './services/classes_services/theme.service';

//Componentes
import { InicioComponent } from './components/loginZone/inicio/inicio.component';
import { NavbarRegisterComponent } from './components/loginZone/navbar-register/navbar-register.component';
import { ButtonLoginComponent } from './components/loginZone/button-login/button-login.component';
import { ExploreComponent } from '@core/components/explore/explore.component'
import { MapComponent } from '@core/components/explore/map/map.component'
import { HomeComponent } from './components/home/home.component';
import { AdminLoginComponent } from './components/adminView/admin-login/admin-login.component';
import { AdminInicioComponent } from './components/adminView/admin-inicio/admin-inicio.component';
import { AdminNavbarComponent } from './components/adminView/admin-navbar/admin-navbar.component';
import { UserGestionComponent } from './components/adminView/user-gestion/user-gestion.component';
import { PhotoGestionComponent } from './components/adminView/photo-gestion/photo-gestion.component';
import { CardUserComponent } from './components/adminView/user-gestion/card-user/card-user.component';
import { PhotoCardComponent } from './components/adminView/photo-gestion/photo-card/photo-card.component';
import { ThemeGestionComponent } from './components/adminView/theme-gestion/theme-gestion.component';
import { TableThemeComponent } from './components/adminView/theme-gestion/table-theme/table-theme.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    InicioComponent,
    NavbarRegisterComponent,
    ButtonLoginComponent,
    ExploreComponent,
    MapComponent,
    HomeComponent,
    AdminLoginComponent,
    AdminInicioComponent,
    AdminNavbarComponent,
    UserGestionComponent,
    FilterUserAdminPipe,
    FilterPublicationAdminPipe,
    FilterThemeAdminPipe,
    PhotoGestionComponent,
    CardUserComponent,
    PhotoCardComponent,
    ThemeGestionComponent,
    TableThemeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule, 
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxPaginationModule
  ],
  providers: [AuthService, 
              UserService, 
              AngularFirestore, 
              PublicationsService,
              ThemeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
