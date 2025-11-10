import { Component, inject } from '@angular/core';
import { BaseMediaListComponent } from '../../shared/components/base-media-list/base-media-list.component';
import { MovieListDto } from '../dtos/movie-list-dto';
import { WatchFilter } from '../enums/watch-filter';
import { MoviesService } from '../services/movies.service';
import { BASE_MEDIA_LIST_IMPORTS } from '../../shared/components/models/base-media-list.imports';
import { MOVIE_LIST_CONFIG } from '../constants/movie-list.config';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [...BASE_MEDIA_LIST_IMPORTS],
  templateUrl: '../../shared/components/base-media-list/base-media-list.component.html',
  styleUrls: ['../../shared/components/base-media-list/base-media-list.component.scss']
})
export class MoviesListComponent extends BaseMediaListComponent<MovieListDto, WatchFilter> {
  protected readonly config = MOVIE_LIST_CONFIG

  private readonly _moviesService = inject(MoviesService);

  protected loadItems(search: string, genreId: string | null, filter: WatchFilter): void {
    this.isLoading.set(true);

    const params = {
      search,
      genreId: genreId === null ? undefined : genreId,
      watchFilter: filter
    }

    this._moviesService.getMoviesList(params).subscribe({
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

  protected toggleStatus(item: MovieListDto): void {
    this._moviesService.toggleWatched(item.id).subscribe({
      next: () => {
        this.items.update(list =>
          list.map(i => (i.id === item.id ? { ...i, isWatched: !i.isWatched } : i))
        );
      }
    });
  }

  protected deleteItem(id: number): void {
    this._moviesService.deleteMovie(id).subscribe({
      next: () => this.items.update(list => list.filter(i => i.id !== id))
    });
  }
}
