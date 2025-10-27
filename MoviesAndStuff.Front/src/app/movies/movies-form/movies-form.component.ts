import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../models/movies';
import { MoviesService } from '../services/movies.service';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { DropdownOption } from '../../components/dropdown/models/dropdown';
import { Genre } from '../models/genres';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-movies-form',
  imports: [ReactiveFormsModule, DropdownComponent],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})
export class MoviesFormComponent implements OnInit {
  private _moviesService = inject(MoviesService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);

  private movie: Movie = new Movie();
  private movieId: number = 0;
  protected genreList: Genre[] = [];
  protected genreDropdown: DropdownOption[] = [];
  protected editingMode: boolean = false;

  //dropdown stuff
  protected selectedGenre: string = '';

  /** Evento disparado ao mudar o valor do dropdown */
  onGenreChange(value: string) {
    this.selectedGenre = value;
  }
  //dropdown stuff end

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
  })

  ngOnInit(): void {
    this.initializeFormData();
  }

  /**
  * Carrega os dados necessários para o formulário (gêneros + filme)
  * de forma sincronizada, garantindo que o dropdown já tenha opções
  * antes de preencher os valores do filme.
  */
  private initializeFormData(): void {
    this.movieId = +this._route.snapshot.params['id'];

    if (!this.movieId) {
      this.getGenresList();
      return;
    }

    forkJoin({
      genres: this._moviesService.getGenresList(),
      movie: this._moviesService.getMovieById(this.movieId)
    }).subscribe({
      next: ({ genres, movie }) => {
        this.genreList = genres;
        this.genreDropdown = this.mapGenresToDropdown(genres);
        this.patchFormWithMovieData(movie);
        this.editingMode = true;
      },
      error: (err) => {
        console.error('Failed to load form data', err);
      }
    });
  }

  /** Mapeia os gêneros retornados pela API para o formato aceito pelo dropdown */
  private mapGenresToDropdown(genres: Genre[]): DropdownOption[] {
    return genres.map(genre => ({
      value: genre.id,
      label: genre.name
    }));
  }

  /** Aplica os dados do filme ao formulário */
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
    })

    this.selectedGenre = movie.genreId;
  }

  /** Carrega apenas a lista de gêneros (modo criar novo filme) */
  private getGenresList(): void {
    this._moviesService.getGenresList().subscribe({
      next: (genres) => {
        this.genreList = genres;
        this.genreDropdown = this.mapGenresToDropdown(genres);

      },
      error: (err) => console.error('Failed to fetch genres:', err)
    });
  }

  get titleHasError(): boolean {
    const titleControl = this.movieForm.get('title');
    return titleControl ? titleControl.invalid && (titleControl.dirty || titleControl.touched) : false;
  }

  protected createMovie() {
    this.assignValues();
    this._moviesService.createMovie(this.movie).subscribe({
      next: () => {

      },
      error: (error: any) => {

      }
    })
  }

  protected updateMovie() {
    this.assignValues();
    this._moviesService.updateMovie(this.movieId, this.movie).subscribe({
    })
  }

  private assignValues() {
    this.movie.title = this.movieForm.controls['title'].value ?? '';
    this.movie.review = this.movieForm.controls['review'].value ?? '';
    this.movie.director = this.movieForm.controls['director'].value ?? '';
    this.movie.genreId = this.selectedGenre;
    this.movie.duration = this.movieForm.controls['duration'].value ?? '';
    this.movie.rating = this.movieForm.controls['rating'].value ?? 0;
    const rawPremiere = this.movieForm.controls['premiereDate'].value;
    this.movie.premiereDate = rawPremiere ? new Date(rawPremiere) : new Date();
    const rawWatch = this.movieForm.controls['watchDate'].value;
    this.movie.watchDate = rawWatch ? new Date(rawWatch) : new Date();
    this.movie.isWatched = this.movieForm.controls['isWatched'].value ?? false;
  }

  returnToList() {
    this._router.navigate(['/movies'])
  }

}
