import { Routes } from '@angular/router';
import { MoviesListComponent } from './movies/movies-list/movies-list.component';
import { MoviesFormComponent } from './movies/movies-form/movies-form.component';

export const routes: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'movies', component: MoviesListComponent },
  { path: 'movies/new', component: MoviesFormComponent },
  { path: 'movies/edit/:id', component: MoviesFormComponent }
];
