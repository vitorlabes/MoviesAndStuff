import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MoviesService } from '../services/movies.service';
import { ToastService } from '../../components/toast/toast.service';
import { DropdownComponent } from '../../components/dropdown/dropdown.component';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, of } from 'rxjs';
import { Movie } from '../models/movies';
import { Genre } from '../models/genres';

@Component({
  selector: 'app-movies-form',
  standalone: true,
  imports: [ReactiveFormsModule, DropdownComponent],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})
export class MoviesFormComponent {
  // Injeções
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private readonly _moviesService = inject(MoviesService);
  private readonly _toast = inject(ToastService);

  // Signals de estado base
  protected readonly movieId = signal<number>(+this._route.snapshot.params['id'] || 0);

  // Signals derivados de dados externos
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

  // Derivados
  protected readonly editingMode = computed(() => this.movieId() > 0);
  protected readonly genreDropdown = computed(() =>
    (this.genres() ?? []).map(g => ({ value: g.id, label: g.name }))
  );

  protected readonly selectedGenre = signal<string | null>(null);

  // Formulário
  protected readonly movieForm = new FormGroup({
    title: new FormControl('', Validators.required),
    review: new FormControl(''),
    director: new FormControl(''),
    genreId: new FormControl(''),
    duration: new FormControl(''),
    rating: new FormControl(0),
    premiereDate: new FormControl(new Date()),
    watchDate: new FormControl(new Date()),
    isWatched: new FormControl(false)
  });

  constructor() {
    // Atualiza form quando dados do filme chegam
    effect(() => {
      const movie = this.movie();
      const genres = this.genres();

      if (movie && (genres?.length ?? 0) > 0) {
        this.patchFormWithMovie(movie);
      }
    });
  }

  // 🧠 Atualiza formulário com dados existentes
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

  // 🔄 Muda o gênero via dropdown
  protected onGenreChange(value: string) {
    this.selectedGenre.set(value);
    this.movieForm.patchValue({ genreId: value });
  }

  // 🚫 Validação
  protected get titleHasError(): boolean {
    const control = this.movieForm.get('title');
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // 💾 Salvar filme
  protected saveMovie(): void {
    if (this.movieForm.invalid) {
      this._toast.error('Please fill all required fields');
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
      genreId: this.selectedGenre()
    } as Movie;
  }

  protected returnToList() {
    this._router.navigate(['/movies']);
  }
}
