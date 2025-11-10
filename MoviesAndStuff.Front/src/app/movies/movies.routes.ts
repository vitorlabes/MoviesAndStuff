import { Routes } from '@angular/router';
import { MoviesListComponent } from './movies-list/movies-list.component';
import { MoviesFormComponent } from './movies-form/movies-form.component';

export const MOVIES_ROUTES: Routes = [
  { path: '', component: MoviesListComponent },
  { path: 'new', component: MoviesFormComponent },
  { path: 'edit/:id', component: MoviesFormComponent }
];
