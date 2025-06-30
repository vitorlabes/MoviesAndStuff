import { Component, OnInit } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../models/movies';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieListDto } from '../dtos/movie-list-dto';


@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss'
})

export class MoviesListComponent implements OnInit {

  constructor(
    private moviesService: MoviesService,
    private router: Router) { }

  public movies: MovieListDto[] = [];
  protected isLoading: boolean = false;

  ngOnInit(): void {
    this.getMoviesList();
  }

  public getMoviesList() {
    this.isLoading = true;
    this.moviesService.getMovieslist().subscribe({
      next: (response: MovieListDto[]) => {
        this.movies = response;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to fetch movies:', err);
        this.isLoading = false;
      }
    });
  }

  navigateToMovieForm() {
    this.router.navigate(['/movies/new'])
  }

}
