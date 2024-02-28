import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { HeroesService } from '../../services/heroes.service';
import { Hero } from '../../interfaces/hero.interface';

@Component({
	selector: 'heroes-search-page',
	templateUrl: './search-page.component.html',
	styleUrls: ['./search-page.component.css']
})
export class SearchPageComponent {

	public searchInput = new FormControl ('');
	public heroes: Hero[] = [];
	public selectedHero?: Hero;

	constructor (private heroesService: HeroesService, private router: Router) {}

	searchHero (): void {
		const value: string = this.searchInput.value || '';
		if (!value) this.heroes = [];
		this.heroesService.getSuggestions (value).subscribe (heroes => this.heroes = heroes);
	}

	onSelectedOption (event: MatAutocompleteSelectedEvent): void {
		if (!event.option.value) return this.selectedHero = undefined;

		const hero: Hero = event.option.value;
		this.searchInput.setValue (hero.superhero);
		this.selectedHero = hero;
	}

	goBack (): void {
		this.router.navigateByUrl ('heroes/list');
	}
}