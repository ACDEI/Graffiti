import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanDeactivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanLoad {
  constructor(private authService: AuthService, private router: Router) { }
    
      canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        let url: string = state.url;
        return this.checkUserLogin(next, url);
      }
      canActivateChild(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return this.canActivate(next, state);
      }
      canDeactivate(
        component: unknown,
        currentRoute: ActivatedRouteSnapshot,
        currentState: RouterStateSnapshot,
        nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
        return true;
      }
      canLoad(
        route: Route,
        segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
        return true;
      }
    
      checkUserLogin(route: ActivatedRouteSnapshot, url: any): boolean {
        if (this.authService.isLoggedIn()) {
          const userRole = this.authService.getRole();  //ADMIN o USER
          if (route.data.role && route.data.role.indexOf(userRole) === -1) {
            if(userRole === 'ADMIN') this.router.navigate(['admin/home']);
            else if(userRole === 'USER') this.router.navigate(['home']);
            else { this.router.navigate(['']); }
            return false;
          }
          return true;
        }
    
        this.router.navigate(['']);
        return false;
      }
}
