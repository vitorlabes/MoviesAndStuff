import { Component, inject } from '@angular/core';
import { BaseMediaListComponent } from '../../shared/components/base-media-list/base-media-list.component';
import { GameListDto } from '../dtos/game-list-dto';
import { PlayFilter } from '../enums/play-filter';
import { GamesService } from '../services/games.service';
import { BASE_MEDIA_LIST_IMPORTS } from '../../shared/components/models/base-media-list.imports';
import { GAME_LIST_CONFIG } from '../constants/game-list.config';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [...BASE_MEDIA_LIST_IMPORTS],
  templateUrl: '../../shared/components/base-media-list/base-media-list.component.html',
  styleUrls: ['../../shared/components/base-media-list/base-media-list.component.scss']
})
export class GamesListComponent extends BaseMediaListComponent<GameListDto, PlayFilter> {
  protected readonly config = GAME_LIST_CONFIG;

  private readonly _gamesService = inject(GamesService);

  protected loadItems(search: string, genreId: string | null, filter: PlayFilter): void {
    this.isLoading.set(true);

    const params = {
      search,
      genreId: genreId === null ? undefined : genreId,
      watchFilter: filter
    }

    this._gamesService.getGamesList(params).subscribe({
      next: (data) => {
        this.items.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.items.set([]);
        this.isLoading.set(false);
      }
    });
  }

  protected toggleStatus(item: GameListDto): void {
    this._gamesService.togglePlayed(item.id).subscribe({
      next: () => {
        this.items.update(list =>
          list.map(i => (i.id === item.id ? { ...i, isPlayed: !i.isPlayed } : i))
        );
      }
    });
  }

  protected deleteItem(id: number): void {
    this._gamesService.deleteGame(id).subscribe({
      next: () => this.items.update(list => list.filter(i => i.id !== id))
    });
  }
}
