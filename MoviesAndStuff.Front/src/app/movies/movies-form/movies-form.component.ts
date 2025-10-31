import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MoviesService } from '../services/movies.service';
import { ToastService } from '../../components/toast/toast.service';
import { Movie } from '../models/movies';
import { Genre } from '../models/genres';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DurationInputComponent } from '../../components/duration-input/duration-input.component';

@Component({
  selector: 'app-movies-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownComponent,
    DurationPipe,
    DurationInputComponent
  ],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})

export class MoviesFormComponent {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _moviesService = inject(MoviesService);
  private readonly _toast = inject(ToastService);

  protected readonly movieId = signal<number>(+this._route.snapshot.params['id'] || 0);

  protected readonly genres = toSignal(
    this._moviesService.getGenresList(),
    { initialValue: [] as Genre[] }
  );

  protected readonly movie = toSignal<Movie | null>(
    of(this.movieId()).pipe(
      switchMap(id => id > 0 ? this._moviesService.getMovieById(id) : of(null))
    ),
    { initialValue: null }
  );

  protected readonly editingMode = computed(() => this.movieId() > 0);
  protected readonly genreDropdown = computed(() =>
    (this.genres() ?? []).map(g => ({ value: g.id, label: g.name }))
  );

  protected readonly selectedGenre = signal<string | null>(null);

  protected readonly movieForm = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    review: new FormControl<string>(''),
    director: new FormControl<string>(''),
    genreId: new FormControl<string>(''),
    duration: new FormControl<number | null>(null, [
      Validators.max(999 * 60 + 59)
    ]),
    rating: new FormControl<number>(0),
    premiereDate: new FormControl<Date>(new Date()),
    watchDate: new FormControl<Date>(new Date()),
    isWatched: new FormControl<boolean>(false)
  });

  constructor() {
    // Updates form with movie data
    effect(() => {
      const movie = this.movie();
      const genres = this.genres();

      if (movie && (genres?.length ?? 0) > 0) {
        this.patchFormWithMovie(movie);
      }
    });
  }

  private patchFormWithMovie(movie: Movie): void {
    this.movieForm.patchValue({
      title: movie.title,
      review: movie.review,
      director: movie.director,
      genreId: movie.genreId,
      duration: movie.duration,
      rating: movie.rating,
      premiereDate: movie.premiereDate ? new Date(movie.premiereDate) : new Date(),
      watchDate: movie.watchDate ? new Date(movie.watchDate) : new Date(),
      isWatched: movie.isWatched ?? false
    });
    this.selectedGenre.set(movie.genreId ?? null);
  }

  protected onGenreChange(value: string) {
    this.selectedGenre.set(value);
    this.movieForm.patchValue({ genreId: value });
  }

  protected get titleHasError(): boolean {
    const control = this.movieForm.get('title');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected get durationHasError(): boolean {
    const control = this.movieForm.get('duration');
    return !!(
      control &&
      control.value !== null &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }


  protected saveMovie(): void {
    if (this.movieForm.invalid) {
      this._toast.error('Please fill all required fields correctly');
      this.movieForm.markAllAsTouched();
      return;
    }

    const movieData = this.mapFormToMovie();
    const save$ = this.editingMode()
      ? this._moviesService.updateMovie(this.movieId(), movieData)
      : this._moviesService.createMovie(movieData);

    save$.subscribe({
      next: () => {
        const action = this.editingMode() ? 'updated' : 'added';
        const emoji = this.editingMode() ? '✨' : '🎬';
        this._toast.success(`${emoji} Movie ${action} successfully!`);
        this.returnToList();
      },
      error: (err) => {
        console.error(err);
        this._toast.error(`Failed to ${this.editingMode() ? 'update' : 'add'} movie.`);
      }
    });
  }

  private mapFormToMovie(): Movie {
    const formValue = this.movieForm.value;
    return {
      ...(this.movie() ?? {}),
      ...formValue,
      genreId: this.selectedGenre(),
      duration: formValue.duration
    } as Movie;
  }

  protected returnToList() {
    this._router.navigate(['/movies']);
  }
}
