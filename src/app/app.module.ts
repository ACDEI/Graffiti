import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';

//firebase
import {AngularFireModule} from "angularfire2";
import {AngularFirestoreModule} from "angularfire2/firestore";
import {environment} from '../environments/environment';
//servicio 
import {LoginService} from "./services/login.service";
import { InicioComponent } from './inicio/inicio.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';
import { NavbarRegisterComponent } from './components/navbar-register/navbar-register.component';
import { ButtonLoginComponent } from './components/button-login/button-login.component';
import { LoginFacebookComponent } from './components/login-facebook/login-facebook.component';
import { ExploreComponent } from '@core/components/explore/explore.component'
import { MapComponent } from '@core/components/explore/map/map.component'

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    InicioComponent,
    ListaUsuariosComponent,
    NavbarRegisterComponent,
    ButtonLoginComponent,
    LoginFacebookComponent,
    ExploreComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
 
    
  ],
  providers: [LoginService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
