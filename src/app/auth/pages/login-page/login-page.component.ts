import { Router } from '@angular/router';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';

@Component({
	selector: 'auth-login-page',
	templateUrl: './login-page.component.html',
	styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent {

	constructor (private authService: AuthService, private router: Router) {}

	onLogin (): void {
		this.authService.login ('dc@gmail.com', '123456').subscribe (user => this.router.navigate (['./']));
	}
}