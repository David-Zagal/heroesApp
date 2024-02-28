import { Injectable } from '@angular/core';
import { Router, CanMatchFn, Route, UrlSegment, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class PublicGuard {

	constructor (private authService: AuthService, private router: Router) {}

	private checkAuthStatus (): boolean | Observable<boolean> {
		return this.authService.checkAuthentication ().pipe (
			tap ((isAuthenticated: boolean) => {
				if (isAuthenticated) this.router.navigate (['./']);
			}),
			map (isAuthenticated => !isAuthenticated),
		);
	}

	canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
		return this.checkAuthStatus ();
	};

	canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
		return this.checkAuthStatus ();
	};
}