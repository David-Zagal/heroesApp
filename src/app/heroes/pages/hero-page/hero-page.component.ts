import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
	selector: 'heroes-hero-page',
	templateUrl: './hero-page.component.html',
	styleUrls: ['./hero-page.component.css']
})
export class HeroPageComponent implements OnInit {

	public hero?: Hero;

	constructor (private heroesService: HeroesService, private activatedRoute: ActivatedRoute, private router: Router) {}

	ngOnInit (): void {
		this.activatedRoute.params.pipe (
			switchMap (({ id }) => this.heroesService.getHeroById (id)),
		).subscribe (hero => {
			// if (!hero) return this.router.navigate (['/heroes/list']);
			if (!hero) return this.router.navigateByUrl ('heroes/list');
			return this.hero = hero;
		});
	}

	goBack (): void {
		this.router.navigateByUrl ('heroes/list');
	}
}