import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

//Routes
import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import { AngularFireModule } from "@angular/fire";
import { AngularFirestore, AngularFirestoreModule } from "@angular/fire/firestore";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { environment } from '../environments/environment';

//Servicios
import {AuthService} from "./services/auth.service";
import {UserService} from './services/classes_services/user.service';
import { ToastrModule } from 'ngx-toastr'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Clases - Models
import {User} from './models/user.model';

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
import { RegisterFormComponent } from './components/adminView/register-form/register-form.component';
import { UserGestionComponent } from './components/adminView/user-gestion/user-gestion.component';
import { TableUserComponent } from './components/adminView/table-user/table-user.component';

//Pipes
import { FilterPipe } from './pipes/filter.pipe'
import { Browser } from 'protractor';

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
    RegisterFormComponent,
    UserGestionComponent,
    TableUserComponent,
    FilterPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    FormsModule, 
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ],
  providers: [AuthService, 
              UserService, 
              AngularFirestore],
  bootstrap: [AppComponent]
})
export class AppModule { }
