import { Component, OnInit, inject, viewChild } from '@angular/core';
import { MoviesService } from '../services/movies.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MovieListDto } from '../dtos/movie-list-dto';
import { ConfirmModalComponent } from '../../components/confirm-modal/confirm-modal.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, Observable, catchError, of, startWith, map, tap, combineLatest } from 'rxjs';
import { DropdownComponent } from "../../components/dropdown/dropdown.component";
import { DropdownOption } from '../../components/dropdown/models/dropdown';

@Component({
  selector: 'app-movies-list',
  standalone: true,
  imports: [CommonModule, ConfirmModalComponent, ReactiveFormsModule, FormsModule, DropdownComponent],
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
  protected genreOptions: DropdownOption[] = [];

  protected selectedGenreId: string | null = null;
  public searchControl = new FormControl<string>('', { nonNullable: true });
  public currentSearchTerm: string = '';

  ngOnInit(): void {
    this.getGenreDropdown();
    this.getMoviesList();
  }

  private getMoviesList(): void {
    this.movies$ = combineLatest([
      this.searchControl.valueChanges.pipe(
        startWith(''),
        debounceTime(400),
        distinctUntilChanged(),
        map(search => search.trim())
      ),
      of(this.selectedGenreId)
    ]).pipe(
      tap(() => this.isLoading = true),
      switchMap(([search, genreId]) => {
        const searchParam = search === '' ? null : search;
        return this._moviesService.getMovieslist(searchParam, genreId).pipe(
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

  private getGenreDropdown(): void {
    this._moviesService.getGenresList().subscribe({
      next: (genres) => {
        this.genreOptions = [
          { label: 'All genres', value: null },
          ...genres.map(g => ({ label: g.name, value: g.id }))
        ];
      },
      error: (err) => console.error('Failed to load genres', err)
    });
  }

  protected onGenreSelected(genreId: string | null): void {
    this.selectedGenreId = genreId;
    this.getMoviesList();
  }

  protected deleteMovie(id: number): void {
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

  protected openDeleteModal(id: number): void {
    this.movieIdToDelete = id;
    this.confirmModal().open(
      `Are you sure you want to delete this movie? This action cannot be undone.`,
      'Delete Movie'
    );
  }

  protected confirmDelete(): void {
    if (this.movieIdToDelete != null) {
      this.deleteMovie(this.movieIdToDelete);
      this.movieIdToDelete = null;
    }
  }

  protected navigateToMovieForm(): void {
    this._router.navigate(['/movies/new']);
  }

  protected navigateToMovieFormUpdate(id: number): void {
    this._router.navigate(['movies/edit', id]);
  }

}

