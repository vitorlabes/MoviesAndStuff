import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseMediaFormComponent } from '../../shared/components/base-media-form/base-media-form.component';
import { MoviesService } from '../services/movies.service';
import { MovieDetailDto } from '../dtos/movie-detail-dto';
import { CreateMovieDto } from '../dtos/movie-create-dto';
import { UpdateMovieDto } from '../dtos/movie-update-dto';
import { MediaFormConfig } from '../../shared/components/base-media-form/models/base-media-form.models';
import { DropdownComponent } from '../../shared/components/ui/dropdown/dropdown.component';
import { DurationPipe } from '../../shared/pipes/duration.pipe';
import { DurationInputComponent } from '../../shared/components/ui/duration-input/duration-input.component';
import { StarRatingComponent } from '../../shared/components/ui/star-rating/star-rating.component';

@Component({
  selector: 'app-movies-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownComponent,
    DurationPipe,
    DurationInputComponent,
    StarRatingComponent
  ],
  templateUrl: './movies-form.component.html',
  styleUrl: '../../shared/components/base-media-form/base-media-form.component.scss'
})
export class MoviesFormComponent extends BaseMediaFormComponent<MovieDetailDto, CreateMovieDto, UpdateMovieDto> {
  protected readonly config: MediaFormConfig = {
    mediaTypeId: 'MOVIE',
    routePrefix: '/movies',
    icon: 'bi-film',
    singularName: 'Movie',
    createEmoji: '🎬',
    updateEmoji: '✨',
    statusProperty: 'isWatched',
    statusLabel: 'Watched',
    dateProperty: 'watchDate',
    dateLabel: 'Watch Date'
  };

  private readonly moviesService = inject(MoviesService);

  protected readonly form = new FormGroup({
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

  protected get movieForm() {
    return this.form;
  }

  protected loadItemById(id: number): Observable<MovieDetailDto> {
    return this.moviesService.getMovieById(id);
  }

  protected patchFormWithItem(movie: MovieDetailDto): void {
    this.form.patchValue({
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

  protected mapFormToCreateDto(): CreateMovieDto {
    const form = this.form.value;
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

  protected mapFormToUpdateDto(): UpdateMovieDto {
    const form = this.form.value;
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

  protected createItem(dto: CreateMovieDto): Observable<any> {
    return this.moviesService.createMovie(dto);
  }

  protected updateItem(id: number, dto: UpdateMovieDto): Observable<any> {
    return this.moviesService.updateMovie(id, dto);
  }

  protected get titleHasError(): boolean {
    return this.hasError('title');
  }

  protected get durationHasError(): boolean {
    return this.hasErrorWithValue('duration');
  }

  protected saveMovie(): void {
    this.saveItem();
  }
}
