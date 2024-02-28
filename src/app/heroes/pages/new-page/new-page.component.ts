import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { filter, switchMap } from 'rxjs';

import { Hero, Publisher } from './../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
	selector: 'heroes-new-page',
	templateUrl: './new-page.component.html',
	styleUrls: ['./new-page.component.css']
})
export class NewPageComponent implements OnInit {

	public heroForm = new FormGroup ({
		id: new FormControl<string> (''),
		superhero: new FormControl<string> ('', { nonNullable: true }),
		publisher: new FormControl<Publisher> (Publisher.DCComics),
		alter_ego: new FormControl (''),
		first_appearance: new FormControl (''),
		characters: new FormControl (''),
		alt_img: new FormControl ('')
	});

	constructor (private heroesService: HeroesService, private activatedRoute: ActivatedRoute,
	private router: Router, private snackbar: MatSnackBar, private dialog: MatDialog) {}

	get currentHero (): Hero {
		const hero = this.heroForm.value as Hero;
		return hero;
	}

	ngOnInit (): void {
		if (!this.router.url.includes ('edit')) return;
		this.activatedRoute.params.pipe (
			switchMap (({ id }) => this.heroesService.getHeroById (id)),
		).subscribe (hero => {
			if (!hero) return this.router.navigateByUrl ('./');
			return this.heroForm.reset (hero);
		});
	}

	public publishers = [
		{ id: 'DC Comics', desc: 'DC - Comics' },
		{ id: 'Marvel Comics', desc: 'Marvel - Comics' },
	];

	onSubmit (): void {
		// console.log ({ formIsValid: this.heroForm.valid, value: this.heroForm.value, });
		if (this.heroForm.invalid) return;
		if (this.currentHero.id) {
			this.heroesService.updateHero (this.currentHero).subscribe (hero => {
				this.showSanckbar (`${ hero.superhero } updated!`);
			});
			return;
		}
		this.heroesService.addHero (this.currentHero).subscribe (hero => {
			this.router.navigate (['./heroes/edit', hero.id]);
			this.showSanckbar (`${ hero.superhero } created!`);
		});
	}

	onDeleteHero (): void {
		if (!this.currentHero.id) throw Error ('Hero id is required');

		const dialogRef = this.dialog.open (ConfirmDialogComponent, {
			data: this.heroForm.value,
		});

		dialogRef.afterClosed ().pipe (
			filter ( (result: boolean) => result),
			switchMap (() => this.heroesService.deleteHeroById (this.currentHero.id)),
			filter ( (wasDeleted: boolean) => wasDeleted),
			// tap (wasDeleted => console.log({ wasDeleted })),
		).subscribe (() => this.router.navigate (['./heroes/list']));

		// dialogRef.afterClosed ().subscribe (result => {
		// 	if (!result) return;

		// 	this.heroesService.deleteHeroById (this.currentHero.id).subscribe (wasDeleted => {
		// 		if (wasDeleted) this.router.navigate (['./heroes']);
		// 	});
		// });
	}

	showSanckbar (message: string): void {
		this.snackbar.open (message, 'done', {
			duration: 2500,
		});
	}

	goBack (): void {
		this.router.navigateByUrl ('./heroes/list');
	}
}