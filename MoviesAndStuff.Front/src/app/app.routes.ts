import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: 'movies', pathMatch: 'full' },
      {
        path: 'movies',
        loadChildren: () => import('./movies/movies.routes').then(m => m.MOVIES_ROUTES)
      },
      {
        path: 'games',
        loadChildren: () => import('./games/games.routes').then(g => g.GAMES_ROUTES)
      },
      {
        path: 'genres',
        loadChildren: () => import('./genres/genres.routes').then(g => g.GENRES_ROUTES)
      }
    ]
  }
];
