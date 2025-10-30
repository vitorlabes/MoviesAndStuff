import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject, effect, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../models/movies';
import { MoviesService } from '../services/movies.service';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { Genre } from '../models/genres';
import { ToastService } from '../../components/toast/toast.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';

@Component({
  selector: 'app-movies-form',
  imports: [ReactiveFormsModule, DropdownComponent],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})
export class MoviesFormComponent {
  private _moviesService = inject(MoviesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastService = inject(ToastService);

  private movie = new Movie();
  private movieId = signal(+this._route.snapshot.params['id'] || 0);

  private genresSignal = toSignal(
    this._moviesService.getGenresList(),
    { initialValue: [] }
  );

  private movieSignal = toSignal(
    of(this.movieId()).pipe(
      switchMap(id => id > 0
        ? this._moviesService.getMovieById(id)
        : of(null)
      )
    ),
    { initialValue: null }
  );

  protected genreList = signal<Genre[]>([]);
  protected editingMode = computed(() => this.movieId() > 0);
  protected selectedGenre = signal<string>('');

  protected genreDropdown = computed(() => {
    const genres = this.genreList();
    return genres.map(genre => ({
      value: genre.id,
      label: genre.name
    }));
  });

  public movieForm = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    review: new FormControl<string>(''),
    director: new FormControl<string>(''),
    genreId: new FormControl<string>(''),
    duration: new FormControl<string>(''),
    rating: new FormControl<number>(0),
    premiereDate: new FormControl<Date>(new Date()),
    watchDate: new FormControl<Date>(new Date()),
    isWatched: new FormControl<boolean>(false)
  });

  constructor() {
    // Effect 1: Carrega genres quando disponível
    effect(() => {
      const genres = this.genresSignal();
      if (genres && genres.length > 0) {
        this.genreList.set(genres);
      }
    });

    // Effect 2: Carrega dados do filme se estiver em modo de edição
    effect(() => {
      const movie = this.movieSignal();
      const genres = this.genresSignal();

      if (movie && genres && genres.length > 0) {
        this.patchFormWithMovieData(movie);
      }
    });
  }

  private patchFormWithMovieData(movie: Movie): void {
    this.movieForm.patchValue({
      title: movie.title,
      review: movie.review,
      director: movie.director,
      genreId: movie.genreId,
      duration: movie.duration,
      rating: movie.rating,
      premiereDate: movie.premiereDate,
      watchDate: movie.watchDate,
      isWatched: movie.isWatched
    });
    this.selectedGenre.set(movie.genreId);
  }

  onGenreChange(value: string) {
    this.selectedGenre.set(value);
    this.movieForm.patchValue({ genreId: value });
  }

  get titleHasError(): boolean {
    const control = this.movieForm.get('title');
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }

  protected saveMovie(): void {
    const isUpdate = this.editingMode();

    if (this.movieForm.invalid) {
      this._toastService.error('Please fill all required fields');
      this.movieForm.markAllAsTouched();
      return;
    }

    const movieData = this.mapFormToMovie();
    const request$ = isUpdate
      ? this._moviesService.updateMovie(this.movieId(), movieData)
      : this._moviesService.createMovie(movieData);

    request$.subscribe({
      next: () => {
        const action = isUpdate ? 'updated' : 'added';
        const emoji = isUpdate ? '✨' : '🎬';
        this._toastService.success(`${emoji} Movie ${action} successfully!`);
        this.returnToList();
      },
      error: (err) => {
        console.error(err);
        this._toastService.error(`Failed to ${isUpdate ? 'update' : 'add'} movie. Please try again.`);
      }
    });
  }

  private mapFormToMovie(): Movie {
    const { title, review, director, duration, rating, premiereDate, watchDate, isWatched } = this.movieForm.value;

    return {
      ...this.movie,
      title: title ?? '',
      review: review ?? '',
      director: director ?? '',
      genreId: this.selectedGenre(),
      duration: duration ?? '',
      rating: rating ?? 0,
      premiereDate: premiereDate ? new Date(premiereDate) : new Date(),
      watchDate: watchDate ? new Date(watchDate) : new Date(),
      isWatched: isWatched ?? false
    };
  }

  returnToList() {
    this._router.navigate(['/movies']);
  }
}
