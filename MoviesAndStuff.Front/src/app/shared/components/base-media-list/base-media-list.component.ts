import { Component, OnInit, computed, effect, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, map, startWith } from 'rxjs';
import { DropdownOption } from '../../../components/dropdown/models/dropdown';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { GenresService } from '../../../genres/services/genres.service';
import { MediaItem, MediaListConfig } from '../models/base-media-list.models';
import { BASE_MEDIA_LIST_IMPORTS } from '../models/base-media-list.imports';

@Component({
  selector: 'app-base-media-list',
  standalone: true,
  imports: [...BASE_MEDIA_LIST_IMPORTS],
  templateUrl: './base-media-list.component.html',
  styleUrls: ['./base-media-list.component.scss']
})
export abstract class BaseMediaListComponent<TDto extends MediaItem, TFilter> implements OnInit {
  // Services
  protected readonly genresService = inject(GenresService);
  protected readonly router = inject(Router);

  // ViewChild
  protected readonly confirmModal = viewChild.required<ConfirmModalComponent>('confirmModal');

  // Signals
  protected readonly isLoading = signal(true);
  protected readonly items = signal<TDto[]>([]);
  protected readonly genres = signal<DropdownOption[]>([]);
  protected readonly selectedGenre = signal<string | null>(null);
  protected readonly selectedFilter = signal<TFilter | null>(null);
  protected readonly itemIdToDelete = signal<number | null>(null);

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

  protected abstract readonly config: MediaListConfig<TFilter>;

  constructor() {
    effect(() => {
      const term = this.currentSearch();
      const genre = this.selectedGenre();
      const filter = this.selectedFilter();
      if (filter != null) {
        this.loadItems(term, genre, filter);
      }
    });
  }

  ngOnInit(): void {
    this.selectedFilter.set(this.config.defaultFilter);
    this.loadGenres();
  }

  protected abstract loadItems(search: string, genreId: string | null, filter: TFilter): void;
  protected abstract toggleStatus(item: TDto): void;
  protected abstract deleteItem(id: number): void;

  private loadGenres(): void {
    this.genresService.getGenresList({
      mediaTypeId: this.config.mediaTypeId,
      isActive: true
    }).subscribe({
      next: (genres) => {
        this.genres.set([
          { label: 'All genres', value: null },
          ...genres.map(g => ({ label: g.name, value: g.id }))
        ]);
      },
      error: (err) => console.error('Failed to load genres', err)
    });
  }

  protected onGenreSelected(value: string | null): void {
    this.selectedGenre.set(value);
  }

  protected setFilter(filter: TFilter): void {
    this.selectedFilter.set(filter);
  }

  protected openDeleteModal(id: number): void {
    this.itemIdToDelete.set(id);
    this.confirmModal().open(
      `Are you sure you want to delete this ${this.config.singularName.toLowerCase()}? This action cannot be undone.`,
      `Delete ${this.config.singularName}`
    );
  }

  protected confirmDelete(): void {
    const id = this.itemIdToDelete();
    if (id !== null) {
      this.deleteItem(id);
      this.itemIdToDelete.set(null);
    }
  }

  protected navigateToNew(): void {
    this.router.navigate([`${this.config.routePrefix}/new`]);
  }

  protected navigateToEdit(id: number): void {
    this.router.navigate([`${this.config.routePrefix}/edit`, id]);
  }

  protected getItemStatus(item: TDto): boolean {
    return item[this.config.statusProperty] as boolean;
  }

  protected getItemDate(item: TDto): any {
    return this.config.dateProperty ? item[this.config.dateProperty] : null;
  }
}
