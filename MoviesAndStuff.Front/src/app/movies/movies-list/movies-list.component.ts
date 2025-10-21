import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieListDto } from '../dtos/movie-list-dto';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, Observable, catchError, of, startWith, map, tap } from 'rxjs';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './movies-list.component.html',
  styleUrl: './movies-list.component.scss'
})

export class MoviesListComponent implements OnInit {
  private _moviesService = inject(MoviesService);
  private _router = inject(Router)

  public confirmModal = viewChild.required<ConfirmModalComponent>('confirmModal');
  private movieIdToDelete: number | null = null;

  protected isLoading: boolean = true;
  protected movies$!: Observable<MovieListDto[]>;

  public searchControl = new FormControl<string>('', { nonNullable: true });
  public currentSearchTerm: string = '';

  ngOnInit(): void {
    this.getMoviesList();
  }

  private getMoviesList(): void {
    this.movies$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      map(search => search.trim()),
      distinctUntilChanged(),

      tap(trimmedSearch => {
        this.currentSearchTerm = trimmedSearch;
        this.isLoading = true;
      }),

      switchMap(trimmedSearch => {
        const searchParam: string | null = trimmedSearch === '' ? null : trimmedSearch;

        return this._moviesService.getMovieslist(searchParam).pipe(
          tap(() => this.isLoading = false),
          catchError(err => {
            console.error('Failed to fetch movies', err);
            this.isLoading = false;
            return of([]);
          })
        );
      })
    );
  }

  protected deleteMovie(id: number) {
    this.isLoading = true;
    this._moviesService.deleteMovie(id).subscribe({
      next: () => {
        this.searchControl.setValue(this.searchControl.value, { emitEvent: true });
      },
      error: (err) => {
        console.error('Error while deleting movie:', err);
        this.isLoading = false;
        alert('Error while deleting movie');
      }
    });
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

