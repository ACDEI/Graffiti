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
import { PublicationViewComponent } from './components/publication-view/publication-view.component';
import { UserProfileComponent } from './components/user-profile/user-profile.component';
import { UsersSearchComponent } from './components/users-search/users-search.component';
import {ThemeGestionComponent} from './components/adminView/theme-gestion/theme-gestion.component';
import { AuthGuard } from '../app/guard/auth.guard';



const routes: Routes = [
  {path:"" , component: InicioComponent},
  {path: "user-search", component: UsersSearchComponent ,  canActivate: [AuthGuard],
      data: {
        role: 'USER'
      }
  },//, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  {path: "explore", component: ExploreComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'USER'
    }
  },
  {path: "home", component: HomeComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'USER'
    }
   },///, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin }
  {path: "publication-view/:pid", component: PublicationViewComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'USER'
    } 
  },
  {path: "user-profile/:uid", component: UserProfileComponent,canActivate: [AuthGuard],
    data: {
      role: 'USER'
    }
  },
  {path: "admin", component: AdminLoginComponent},
  {path: "admin/home", component: AdminInicioComponent , canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  },//, canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/user_gest", component: UserGestionComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  },//, canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/publ_gest", component: PhotoGestionComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  },// , canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }},
  {path: "admin/theme_gest", component: ThemeGestionComponent ,  canActivate: [AuthGuard],
    data: {
      role: 'ADMIN'
    }
  },// , canActivate: [AdminGuard], data: { authGuardPipe: redirectUnauthorizedAdmin }}
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