import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieListDto } from '../dtos/movie-list-dto';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss'
})

export class MoviesListComponent implements OnInit {
  private _moviesService = inject(MoviesService);
  private _router = inject(Router)

  public confirmModal = viewChild.required<ConfirmModalComponent>('confirmModal');

  private movieIdToDelete: number | null = null;
  protected movies: MovieListDto[] = [];
  protected isLoading: boolean = false;

  ngOnInit(): void {
    this.getMoviesList();
  }

  protected getMoviesList() {
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

  protected deleteMovie(id: number) {
    this.isLoading = true;
    this._moviesService.deleteMovie(id).subscribe({
      next: () => {
        this.movies = this.movies.filter(m => m.id != id);
      },
      error: (err) => {
        console.error('Error while deleting movie:', err);
        alert('Error while deleting movie');
      }
    })
  }

  protected openDeleteModal(id: number) {
    this.movieIdToDelete = id;
    this.confirmModal().open(
      `Are you sure you want to delete this movie? This action cannot be undone.`,
      'Delete Movie'
    );
  }

  protected confirmDelete() {
    if (this.movieIdToDelete != null) {
      this.deleteMovie(this.movieIdToDelete);
      this.movieIdToDelete = null;
    }
  }

  protected navigateToMovieForm() {
    this._router.navigate(['/movies/new']);
  }

  protected navigateToMovieFormUpdate(id: number) {
    this._router.navigate(['movies/edit', id]);
  }

}
