import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseMediaListComponent } from '../../shared/components/base-media-list/base-media-list.component';
import { GameListDto } from '../dtos/game-list-dto';
import { PlayFilter } from '../enums/play-filter';
import { PLAY_FILTER_OPTIONS } from '../constants/play-filter-options';
import { GamesService } from '../services/games.service';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MediaListConfig } from '../../shared/components/models/base-media-list.models';

@Component({
  selector: 'app-games-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DropdownComponent, ConfirmModalComponent],
  templateUrl: '../../shared/components/base-media-list/base-media-list.component.html',
  styleUrls: ['../../shared/components/base-media-list/base-media-list.component.scss']
})
export class GamesListComponent extends BaseMediaListComponent<GameListDto, PlayFilter> {
  protected readonly config: MediaListConfig<PlayFilter> = {
    mediaTypeId: 'GAME',
    routePrefix: '/games',
    icon: 'bi-controller',
    collectionName: 'Game Collection',
    singularName: 'Game',
    searchPlaceholder: 'Search game by title...',
    emptyStateMessage: 'No games in your collection yet.',
    loadingMessage: 'Loading games...',
    filterOptions: PLAY_FILTER_OPTIONS,
    defaultFilter: PlayFilter.All,
    statusProperty: 'isPlayed',
    statusLabel: { active: 'Played', inactive: 'Queue' },
    dateProperty: 'playDate',
    showDateColumn: true,
    dateColumnLabel: 'Played On'
  };

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
