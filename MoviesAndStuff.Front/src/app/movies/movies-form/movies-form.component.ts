import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../models/movies';
import { MoviesService } from '../services/movies.service';
import { DropdownComponent } from "../../components/dropdown.component";
import { DropdownOption } from '../../components/models/dropdown';
import { Genre } from '../models/genres';

@Component({
  selector: 'app-movies-form',
  imports: [ReactiveFormsModule, DropdownComponent],
  templateUrl: './movies-form.component.html',
  styleUrl: './movies-form.component.scss'
})
export class MoviesFormComponent implements OnInit {
  constructor(
    private router: Router,
    private moviesService: MoviesService) { }

  movie: Movie = new Movie();
  genreList: Genre[] = [];
  genreDropdown: DropdownOption[] = [];

  //dropdown stuff
  selectedGenre: string = '';

  onGenreChange(value: string) {
    this.selectedGenre = value;
  }
  //dropdown stuff end

  ngOnInit(): void {
    this.getGenresList();
  }

  movieForm = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    review: new FormControl<string>(''),
    director: new FormControl<string>(''),
    genre: new FormControl<string>(''),
    duration: new FormControl<string>(''),
    rating: new FormControl<number>(0),
    premiereDate: new FormControl<Date>(new Date()),
    watchDate: new FormControl<Date>(new Date()),
    isWatched: new FormControl<boolean>(false)
  })

  get titleHasError(): boolean {
    const titleControl = this.movieForm.get('title');
    return titleControl ? titleControl.invalid && (titleControl.dirty || titleControl.touched) : false;
  }

  // get isFormValid(): boolean {
  //   if (!this.movieForm.valid) {
  //     return false;
  //   }

  //   const { title } = this.movieForm.value

  //   if (!title || title.trim() === '') {
  //     return false;
  //   }

  //   return true;
  // }

  public getGenresList() {
    this.moviesService.getGenresList().subscribe({
      next: (response) => {
        this.genreList = response;

        this.genreDropdown = this.genreList.map(g => {
          return {
            value: g.id,
            label: g.name
          }
        });
      },
      error: (err) => {
        console.error('Failed to fetch genres:', err);
      }
    });
  }

  createMovie() {
    this.assignValues()
    this.moviesService.createMovie(this.movie).subscribe({
      next: () => {

      },
      error: (error: any) => {

      }
    })
  }

  assignValues() {
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
    this.router.navigate(['/movies'])
  }

}
