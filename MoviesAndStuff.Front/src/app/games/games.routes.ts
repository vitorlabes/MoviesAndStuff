import { Routes } from "@angular/router";
import { GamesListComponent } from "./games-list/games-list.component";
import { GamesFormComponent } from "./games-form/games-form.component";

export const GAMES_ROUTES: Routes = [
  { path: '', component: GamesListComponent },
  { path: 'new', component: GamesFormComponent },
  { path: 'edit/:id', component: GamesFormComponent }
]
