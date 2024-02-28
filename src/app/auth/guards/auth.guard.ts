import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanMatchFn, Route, Router, RouterStateSnapshot, UrlSegment } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({providedIn: 'root'})
export class AuthGuard {

	constructor (private authService: AuthService, private router: Router) {}

	private checkAuthStatus (): boolean | Observable<boolean> {
		return this.authService.checkAuthentication ().pipe (
			tap ((isAuthenticated: boolean) => {
				console.log (isAuthenticated);
				if (!isAuthenticated) this.router.navigate (['/auth']); // this.router.navigate (['./auth/login']);
			}),
		);
	}

	canMatch: CanMatchFn = (route: Route, segments: UrlSegment[]): boolean | Observable<boolean> => {
		// console.log ('CanMatch');
		// console.log ({ route, segments });
		// throw new Error ('Method not implemented');
		return this.checkAuthStatus ();
	};

	canActivate: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> => {
		// console.log ('CanActivate');
		// console.log ({ route, state });
		// throw new Error ('Method not implemented');
		return this.checkAuthStatus ();
	};
}

// const checkAuthStatus = (): boolean | Observable<boolean> => {
 	// se inyectan el AuthService y el Router
// 	const authService: AuthService = inject (AuthService);
// 	const router: Router = inject (Router);

// 	return authService.checkAuthentication ().pipe (
// 		tap ((isAuthenticated: boolean) => {
// 			if (!isAuthenticated) router.navigate (['./auth/login']);
// 		})
// 	);
// };

// export const canMatchGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => { // Tipado CanMatchFN
	// console.log('CanMatch');
	// console.log({ route, segments });
	// return inject (AuthGuard).checkAuthStatus();
// };

// export const canActivateGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {	// Hay que tener en cuenta el tipado CanActiveFn
	// console.log ('CanActivate');
	// console.log ({ route, state });
	// return inject (AuthGuard).checkAuthStatus ();
// };