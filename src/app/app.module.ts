import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

//Adicionales
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxPaginationModule } from 'ngx-pagination';

//Routes
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreModule } from "@angular/fire/firestore";
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
import { HttpClientModule } from '@angular/common/http';

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
import { PhotoModalComponent } from './components/adminView/photo-gestion/photo-card/photo-modal/photo-modal.component';
import { UserModalComponent } from './components/adminView/user-gestion/card-user/user-modal/user-modal.component';
import { ExplModalComponent } from './components/explore/expl-modal/expl-modal.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';
import { AdminGuard } from './guard/admin.guard';
import { StatsComponent } from './components/explore/stats/stats.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CardPublicationComponent } from './components/cards/card-publication/card-publication.component';
import { PublicationViewComponent } from './components/publication-view/publication-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { LazyForDirective } from './directives/lazy-for.directive';
import { CardPublicationProfileComponent } from './components/cards/card-publication-profile/card-publication-profile.component';
import { PubMapComponent } from './components/publication-view/map/pub-map/pub-map.component';


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
    PhotoModalComponent,
    UserModalComponent,
    ExplModalComponent,
    StatsComponent,
    NavbarComponent,
    CardPublicationComponent,
    PublicationViewComponent,
    UserProfileComponent,
    LazyForDirective,
    CardPublicationProfileComponent,
    PubMapComponent,
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
    NgxPaginationModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AuthService, 
              UserService, 
              AngularFirestore, 
              PublicationsService,
              User,
              ThemeService,
              AngularFireAuthGuard, 
              AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
