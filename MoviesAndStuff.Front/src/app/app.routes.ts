import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { MoviesListComponent } from './movies/movies-list/movies-list.component';
import { MoviesFormComponent } from './movies/movies-form/movies-form.component';
import { GamesListComponent } from './games/games-list/games-list.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'movies', pathMatch: 'full' },
      { path: 'movies', component: MoviesListComponent },
      { path: 'movies/new', component: MoviesFormComponent },
      { path: 'movies/edit/:id', component: MoviesFormComponent },

      { path: 'games', component: GamesListComponent }
    ]
  }
];
