import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './components/adminView/admin-login/admin-login.component';
import { AppComponent } from './app.component';
import { ExploreComponent } from './components/explore/explore.component';
import { HomeComponent } from './components/home/home.component';
import { LoginFormComponent } from './components/adminView/admin-login/login-form/login-form.component';
import { RegisterFormComponent } from './components/adminView/admin-login/register-form/register-form.component';
import { InicioComponent } from './components/loginZone/inicio/inicio.component';
import { AdminInicioComponent } from './components/adminView/admin-inicio/admin-inicio.component';
import { TableUserComponent } from './components/adminView/user-gestion/table-user/table-user.component';
import { UserGestionComponent } from './components/adminView/user-gestion/user-gestion.component';
import { PhotoTableComponent } from './components/adminView/photo-gestion/photo-table/photo-table.component';
import { PhotoGestionComponent } from './components/adminView/photo-gestion/photo-gestion.component';
import { ThemeGestionComponent } from './components/adminView/theme-gestion/theme-gestion.component';

const routes: Routes = [
  {path:"" , component: InicioComponent},
  {path: "explore", component: ExploreComponent},
  {path: "home", component: HomeComponent},
  {path: "admin", component: AdminLoginComponent},
  {path: "admin/home", component: AdminInicioComponent},
  {path: "admin/user_gest", component: UserGestionComponent},
  {path: "admin/publ_gest", component: PhotoGestionComponent},
  {path: "admin/theme_gest", component: ThemeGestionComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginFormComponent, 
  RegisterFormComponent, 
  TableUserComponent,
  PhotoTableComponent
];