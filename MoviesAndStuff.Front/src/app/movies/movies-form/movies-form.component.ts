import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { MoviesService } from '../services/movies.service';
import { ToastService } from '../../components/toast/toast.service';
import { Genre } from '../../genres/models/genres';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { DurationPipe } from '../../pipes/duration.pipe';
import { DurationInputComponent } from '../../components/duration-input/duration-input.component';
import { StarRatingComponent } from '../../components/star-rating/star-rating.component';
import { MovieDetailDto } from '../dtos/movie-detail-dto';
import { CreateMovieDto } from '../dtos/movie-create-dto';
import { UpdateMovieDto } from '../dtos/movie-update-dto';
import { GenresService } from '../../genres/services/genres.service';

@Component({
  selector: 'app-movies-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownComponent,
    DurationPipe,
    DurationInputComponent,
    StarRatingComponent
  ],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})
export class MoviesFormComponent {
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _moviesService = inject(MoviesService);
  private readonly _genresService = inject(GenresService)
  private readonly _toast = inject(ToastService);

  protected readonly movieId = signal<number>(+this._route.snapshot.params['id'] || 0);

  protected readonly genres = toSignal(
    this._genresService.getGenresList({ mediaTypeId: 'MOVIE', isActive: true }),
    { initialValue: [] as Genre[] }
  );

  protected readonly movie = toSignal<MovieDetailDto | null>(
    of(this.movieId()).pipe(
      switchMap(id => id > 0 ? this._moviesService.getMovieById(id) : of(null))
    ),
    { initialValue: null }
  );

  protected readonly editingMode = computed(() => this.movieId() > 0);
  protected readonly genreDropdown = computed(() =>
    (this.genres() ?? []).map(g => ({ value: g.id, label: g.name }))
  );

  protected readonly selectedGenre = signal<number | null>(null);

  protected readonly movieForm = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    review: new FormControl<string>(''),
    director: new FormControl<string>(''),
    genreId: new FormControl<number | null>(0, Validators.required),
    duration: new FormControl<number | null>(null, [
      Validators.max(999 * 60 + 59)
    ]),
    rating: new FormControl<number>(0),
    premiereDate: new FormControl<Date>(new Date()),
    watchDate: new FormControl<Date>(new Date()),
    isWatched: new FormControl<boolean>(false)
  });

  constructor() {
    effect(() => {
      const movie = this.movie();
      const genres = this.genres();

      if (movie && (genres?.length ?? 0) > 0) {
        this.patchFormWithMovie(movie);
      }
    });
  }

  private patchFormWithMovie(movie: MovieDetailDto): void {
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

  protected onGenreChange(value: number) {
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

    const save$ = this.editingMode()
      ? this._moviesService.updateMovie(this.movieId(), this.mapFormToUpdateDto())
      : this._moviesService.createMovie(this.mapFormToCreateDto());

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

  private mapFormToCreateDto(): CreateMovieDto {
    const form = this.movieForm.value;
    return {
      title: form.title!,
      review: form.review || undefined,
      director: form.director || undefined,
      genreId: this.selectedGenre() || undefined,
      duration: form.duration || undefined,
      rating: form.rating || undefined,
      premiereDate: form.premiereDate || undefined,
      watchDate: form.watchDate || undefined,
      isWatched: form.isWatched ?? false
    };
  }

  private mapFormToUpdateDto(): UpdateMovieDto {
    const form = this.movieForm.value;
    return {
      title: form.title!,
      review: form.review || undefined,
      director: form.director || undefined,
      genreId: this.selectedGenre() || undefined,
      duration: form.duration || undefined,
      rating: form.rating || undefined,
      premiereDate: form.premiereDate || undefined,
      watchDate: form.watchDate || undefined,
      isWatched: form.isWatched ?? false
    };
  }

  protected returnToList() {
    this._router.navigate(['/movies']);
  }
}
