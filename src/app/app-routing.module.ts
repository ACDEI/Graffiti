import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { ListaUsuariosComponent } from './lista-usuarios/lista-usuarios.component';



const routes: Routes = [
  {path:"" , component: InicioComponent},
  {path:"login" , component: LoginComponent},
  {path:"listaUsuarios",component: ListaUsuariosComponent},
  {path: "explore", component: ExploreComponent},
  {path: "home", component: HomeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginComponent];

