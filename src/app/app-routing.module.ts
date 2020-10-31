import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './components/adminView/admin-login/admin-login.component';
import { AppComponent } from './app.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/adminView/login-form/login-form.component';
import { InicioComponent } from './components/loginZone/inicio/inicio.component';
import { ListaUsuariosComponent } from './components/lista-usuarios/lista-usuarios.component';
import { AdminInicioComponent } from './components/adminView/admin-inicio/admin-inicio.component';

const routes: Routes = [
  {path:"" , component: InicioComponent},
  {path:"listaUsuarios",component: ListaUsuariosComponent},
  {path: "explore", component: ExploreComponent},
  {path: "home", component: HomeComponent},
  {path: "admin", component: AdminLoginComponent},
  {path: "adminHome", component: AdminInicioComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginFormComponent];

