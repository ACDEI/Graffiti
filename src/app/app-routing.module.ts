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
import {AngularFireAuthGuard, hasCustomClaim, redirectUnauthorizedTo, redirectLoggedInTo} from '@angular/fire/auth-guard';
import {AdminGuard} from './guard/admin.guard';
import { PublicationViewComponent } from './components/publication-view/publication-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';

const adminOnly = () => hasCustomClaim('admin');
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo([""]);
const redirectUnauthorizedAdmin = () => redirectUnauthorizedTo([""]);

const routes: Routes = [
  {path:"" , component: InicioComponent},
  {path: "explore", component: ExploreComponent},
  {path: "home", component: HomeComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: "publication-view/:pid", component: PublicationViewComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: "user-profile/:uid", component: UserProfileComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }},
  {path: "admin", component: AdminLoginComponent},
  {path: "admin/home", component: AdminInicioComponent, canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/user_gest", component: UserGestionComponent, canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/publ_gest", component: PhotoGestionComponent , canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/theme_gest", component: ThemeGestionComponent , canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
export const routingComponents = [LoginFormComponent, 
  RegisterFormComponent, 
  TableUserComponent,
  PhotoTableComponent
];