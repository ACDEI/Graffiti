import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import {AngularFireModule} from "angularfire2";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {environment} from '../environments/environment';
import { AngularFireAuthModule } from '@angular/fire/auth';

//Servicios
import {LoginService} from "./services/login.service";

//Clases - Models
import {User} from './models/user.model';

//Componentes
import { InicioComponent } from './components/loginZone/inicio/inicio.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { NavbarRegisterComponent } from './components/loginZone/navbar-register/navbar-register.component';
import { ButtonLoginComponent } from './components/loginZone/button-login/button-login.component';
import { ExploreComponent } from '@core/components/explore/explore.component'
import { MapComponent } from '@core/components/explore/map/map.component'
import { HomeComponent } from './components/home/home.component';
import { AdminLoginComponent } from './components/adminView/admin-login/admin-login.component';
import { AdminInicioComponent } from './components/adminView/admin-inicio/admin-inicio.component';
import { AdminNavbarComponent } from './components/adminView/admin-navbar/admin-navbar.component';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    InicioComponent,
    ListaUsuariosComponent,
    NavbarRegisterComponent,
    ButtonLoginComponent,
    ExploreComponent,
    MapComponent,
    HomeComponent,
    AdminLoginComponent,
    AdminInicioComponent,
    AdminNavbarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    FormsModule,
  ],
  providers: [LoginService, User],
  bootstrap: [AppComponent]
})
export class AppModule { }
