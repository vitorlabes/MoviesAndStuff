import { Component, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { MoviesService } from '../services/movies.service';
import { MovieListDto } from '../dtos/movie-list-dto';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { DropdownOption } from '../../components/dropdown/models/dropdown';
import { WatchFilter } from '../enums/watch-filter';
import { WATCH_FILTER_OPTIONS } from '../constants/watch-filter-options';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, DropdownComponent, ConfirmModalComponent],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss'
})
export class MoviesListComponent implements OnInit {
  // Injeções
  private readonly _moviesService = inject(MoviesService);
  private readonly _router = inject(Router);

  // ViewChild
  protected readonly confirmModal = viewChild.required<ConfirmModalComponent>('confirmModal');

  // Signals de estado
  protected readonly isLoading = signal(true);
  protected readonly movies = signal<MovieListDto[]>([]);
  protected readonly genres = signal<DropdownOption[]>([]);
  protected readonly selectedGenre = signal<string | null>(null);
  protected readonly selectedFilter = signal<WatchFilter>(WatchFilter.All);
  protected readonly movieIdToDelete = signal<number | null>(null);

  // Search control
  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      map(term => term.trim())
    )
  );

  // Computed
  protected readonly hasResults = computed(() => this.movies().length > 0);
  protected readonly currentSearch = computed(() => this.searchTerm() ?? '');
  protected readonly showEmptySearch = computed(() =>
    !this.isLoading() && !this.hasResults() && this.currentSearch().length > 0
  );
  protected readonly showEmptyState = computed(() =>
    !this.isLoading() && !this.hasResults() && this.currentSearch().length === 0
  );

  // Constantes
  protected readonly watchFilterOptions = WATCH_FILTER_OPTIONS;
  protected readonly WatchFilter = WatchFilter;

  constructor() {
    // Recarrega filmes sempre que filtros mudam
    effect(() => {
      const term = this.currentSearch();
      const genre = this.selectedGenre();
      const filter = this.selectedFilter();
      this.loadMovies(term, genre, filter);
    });
  }

  ngOnInit(): void {
    this.loadGenres();
  }

  private loadMovies(search: string, genreId: string | null, filter: WatchFilter): void {
    this.isLoading.set(true);
    this._moviesService.getMoviesList({
      search: search || undefined,
      genreId: genreId || undefined,
      watchFilter: filter
    }).subscribe({
      next: (movies) => {
        this.movies.set(movies);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch movies', err);
        this.movies.set([]);
        this.isLoading.set(false);
      }
    });
  }

  private loadGenres(): void {
    this._moviesService.getGenresList().subscribe({
      next: (genres) => {
        this.genres.set([
          { label: 'All genres', value: null },
          ...genres.map(g => ({ label: g.name, value: g.id }))
        ]);
      },
      error: (err) => console.error('Failed to load genres', err)
    });
  }

  // Interações
  protected onGenreSelected(value: string | null): void {
    this.selectedGenre.set(value);
  }

  protected setWatchFilter(filter: WatchFilter): void {
    this.selectedFilter.set(filter);
  }

  protected toggleWatched(movie: MovieListDto): void {
    this._moviesService.toggleWatched(movie.id).subscribe({
      next: () => {
        this.movies.update(list =>
          list.map(m => (m.id === movie.id ? { ...m, isWatched: !m.isWatched } : m))
        );
      },
      error: (err) => console.error('Error toggling watched status:', err)
    });
  }

  protected deleteMovie(id: number): void {
    this.isLoading.set(true);
    this._moviesService.deleteMovie(id).subscribe({
      next: () => {
        this.movies.update(list => list.filter(m => m.id !== id));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error deleting movie', err);
        this.isLoading.set(false);
      }
    });
  }

  protected openDeleteModal(id: number): void {
    this.movieIdToDelete.set(id);
    this.confirmModal().open(
      `Are you sure you want to delete this movie? This action cannot be undone.`,
      'Delete Movie'
    );
  }

  protected confirmDelete(): void {
    const id = this.movieIdToDelete();
    if (id !== null) {
      this.deleteMovie(id);
      this.movieIdToDelete.set(null);
    }
  }

  protected navigateToNew(): void {
    this._router.navigate(['/movies/new']);
  }

  protected navigateToEdit(id: number): void {
    this._router.navigate(['movies/edit', id]);
  }
}
