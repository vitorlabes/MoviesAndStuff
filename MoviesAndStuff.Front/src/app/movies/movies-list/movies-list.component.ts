import { Component, OnInit, inject } from '@angular/core';
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

  private _moviesService = inject(MoviesService);
  private _router = inject(Router)

  protected movies: MovieListDto[] = [];
  protected isLoading: boolean = false;

  ngOnInit(): void {
    this.getMoviesList();
  }

  public getMoviesList() {
    this.isLoading = true;
    this._moviesService.getMovieslist().subscribe({
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

  protected navigateToMovieForm() {
    this._router.navigate(['/movies/new']);
  }

  protected navigateToMovieFormUpdate(id: number) {
    this._router.navigate(['movies/edit', id]);
  }

}
