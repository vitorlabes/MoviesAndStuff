import { Component, OnInit, computed, inject, signal, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { GenresService } from '../services/genres.service';
import { MediaTableComponent } from "../../shared/components/ui/media-table/media-table.component";
import { GenreListDto } from '../dtos/genre-list-dto';
import { TableColumnDirective } from '../../shared/components/ui/media-table/table-column.directive';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { GenreModalComponent } from '../genres-form/genres-modal.component';

@Component({
  selector: 'app-genres-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MediaTableComponent, TableColumnDirective, BadgeComponent, GenreModalComponent],
  templateUrl: './genres-list.component.html',
  styleUrls: ['../../shared/components/base-media-list/base-media-list.component.scss']
})
export class GenresListComponent implements OnInit {
  // Services
  protected readonly genresService = inject(GenresService);
  protected readonly router = inject(Router);

  // ViewChilds
  protected readonly genreModal = viewChild.required<GenreModalComponent>('genreModal');

  // Signals
  protected readonly isLoading = signal(true);
  protected readonly items = signal<GenreListDto[]>([]);

  // Search
  protected readonly searchControl = new FormControl<string>('', { nonNullable: true });
  private readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      map(term => term.trim())
    )
  );

  // Computed
  protected readonly hasResults = computed(() => this.items().length > 0);
  protected readonly currentSearch = computed(() => this.searchTerm() ?? '');
  protected readonly showEmptySearch = computed(() =>
    !this.isLoading() && !this.hasResults() && this.currentSearch().length > 0
  );
  protected readonly showEmptyState = computed(() =>
    !this.isLoading() && !this.hasResults() && this.currentSearch().length === 0
  );

  ngOnInit(): void {
    this.loadGenres();
  }

  private loadGenres(): void {
    this.isLoading.set(true);

    this.genresService.getGenresList().subscribe({
      next: (genres) => {
        this.items.set(genres);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load genres', err)
        this.items.set([]);
        this.isLoading.set(false);
      }
    });
  }

  protected reloadGenres(): void {
    this.loadGenres();
  }

  protected openModal(id?: number): void {
    this.genreModal().open(id);
  }

}
