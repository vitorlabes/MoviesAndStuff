import { Component, computed, effect, inject, OnInit, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../components/toast/toast.service';
import { GenresService } from '../../../genres/services/genres.service';
import { Genre } from '../../../genres/models/genres';
import { MediaFormConfig } from '../models/base-media-form.models';

/**
 * Base component for media forms (Movie, Game, etc.)
 * Provides common form functionality with template method pattern
 */
@Component({
  selector: 'app-base-media-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  template: '',
  styles: []
})
export abstract class BaseMediaFormComponent<TDetailDto, TCreateDto, TUpdateDto> implements OnInit {
  // Services
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly genresService = inject(GenresService);
  protected readonly toast = inject(ToastService);

  // Abstract properties
  protected abstract readonly config: MediaFormConfig;
  protected abstract readonly form: FormGroup;

  protected abstract loadItemById(id: number): Observable<TDetailDto>;
  protected abstract patchFormWithItem(item: TDetailDto): void;
  protected abstract mapFormToCreateDto(): TCreateDto;
  protected abstract mapFormToUpdateDto(): TUpdateDto;
  protected abstract createItem(dto: TCreateDto): Observable<any>;
  protected abstract updateItem(id: number, dto: TUpdateDto): Observable<any>;

  // Signals
  protected readonly itemId = signal<number>(0);
  protected readonly selectedGenre = signal<number | null>(null);
  protected readonly genres = signal<Genre[]>([]);
  protected readonly item = signal<TDetailDto | null>(null);

  // Computed
  protected readonly editingMode = computed(() => this.itemId() > 0);
  protected readonly genreDropdown = computed(() =>
    (this.genres() ?? []).map(g => ({ value: g.id, label: g.name }))
  );

  constructor() {
    effect(() => {
      const item = this.item();
      const genres = this.genres();

      if (item && (genres?.length ?? 0) > 0) {
        this.patchFormWithItem(item);
      }
    });
  }

  ngOnInit(): void {
    this.initializeItemId();
    this.loadGenres();
    this.loadItemIfEditing();
  }

  private initializeItemId(): void {
    this.itemId.set(+this.route.snapshot.params['id'] || 0);
  }

  private loadGenres(): void {
    this.genresService.getGenresList({
      mediaTypeId: this.config.mediaTypeId,
      isActive: true
    }).subscribe({
      next: (genres) => this.genres.set(genres),
      error: (err) => console.error('Failed to load genres', err)
    });
  }

  private loadItemIfEditing(): void {
    if (this.itemId() > 0) {
      this.loadItemById(this.itemId()).subscribe({
        next: (item) => this.item.set(item),
        error: (err) => console.error('Failed to load item', err)
      });
    }
  }

  protected onGenreChange(value: number): void {
    this.selectedGenre.set(value);
    this.form.patchValue({ genreId: value });
  }

  protected saveItem(): void {
    if (this.form.invalid) {
      this.toast.error('Please fill all required fields correctly');
      this.form.markAllAsTouched();
      return;
    }

    const save$ = this.editingMode()
      ? this.updateItem(this.itemId(), this.mapFormToUpdateDto())
      : this.createItem(this.mapFormToCreateDto());

    save$.subscribe({
      next: () => {
        const action = this.editingMode() ? 'updated' : 'added';
        const emoji = this.editingMode()
          ? this.config.updateEmoji
          : this.config.createEmoji;

        this.toast.success(
          `${emoji} ${this.config.singularName} ${action} successfully!`
        );
        this.returnToList();
      },
      error: (err) => {
        console.error(err);
        this.toast.error(
          `Failed to ${this.editingMode() ? 'update' : 'add'} ${this.config.singularName.toLowerCase()}.`
        );
      }
    });
  }

  protected returnToList(): void {
    this.router.navigate([this.config.routePrefix]);
  }

  protected hasError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  protected hasErrorWithValue(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(
      control &&
      control.value !== null &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  protected getControlValue(controlName: string): any {
    return this.form.get(controlName)?.value;
  }
}
