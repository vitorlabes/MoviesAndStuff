import { Component, EventEmitter, computed, inject, output, signal } from '@angular/core';
import { GenresService } from '../services/genres.service';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MediaTypeListDto } from '../dtos/media-type-list-dto';
import { Observable } from 'rxjs';
import { GenreDetailDto } from '../dtos/genre-detail-dto';
import { GenreFormDto } from '../dtos/genre-form-dto';
import { DropdownComponent } from "../../shared/components/ui/dropdown/dropdown.component";

@Component({
  selector: 'app-genres-modal',
  imports: [ReactiveFormsModule, DropdownComponent],
  templateUrl: './genres-modal.component.html'
})
export class GenreModalComponent {
  private readonly genresService = inject(GenresService);

  public show = signal(false);
  public isEditing = signal(false);

  public cancel = output<void>();
  public saved = output<void>();

  public genreId: number = 0;

  protected mediaTypes = signal<MediaTypeListDto[]>([]);
  protected selectedMediaTypes = signal<string[]>([]);

  protected mediaTypesDropdown = computed(() =>
    this.mediaTypes().map(mt => ({ value: mt.id, label: mt.name }))
  );

  protected readonly form = new FormGroup({
    name: new FormControl<string>(''),
    mediaTypeIds: new FormControl<string[]>([])
  });

  private loadGenreById(id: number): Observable<GenreDetailDto> {
    return this.genresService.getGenreById(id);
  }

  private loadMediaTypes(): void {
    if (this.mediaTypes().length > 0) {
      return;
    }

    this.genresService.getMediaTypeList().subscribe({
      next: (mediaTypes: MediaTypeListDto[]) => {
        this.mediaTypes.set(mediaTypes);
      },
      error: (err) => {
        console.error('Failed to fetch media types', err);
      }
    });
  }

  protected save() {
    if (this.form.invalid) return;

    const value = this.form.value;

    const dto: GenreFormDto = {
      name: value.name!,
      mediaTypeIds: value.mediaTypeIds!
    };

    if (this.isEditing()) {
      this.genresService.updateGenre(this.genreId, dto).subscribe(() => {
        this.saved.emit();
        this.close();
      });
      return;
    }

    this.genresService.createGenre(dto).subscribe(() => {
      this.saved.emit();
      this.close();
    });
  }

  public open(id?: number) {
    this.show.set(true);
    this.isEditing.set(!!id);

    this.loadMediaTypes();

    if (id) {
      this.loadGenreById(id).subscribe({
        next: (genre: GenreDetailDto) => {
          const ids = (genre.mediaTypes ?? [])
            .map((mt: any) => {
              if (!mt) return '';
              if (typeof mt === 'string') return mt;
              return mt.mediaTypeId ?? mt.MediaTypeId ?? mt.mediaType?.id ?? mt.id ?? mt.value ?? '';
            })
            .map((v: any) => String(v).trim())
            .filter((v: string) => v.length > 0);

          this.form.patchValue({
            name: genre.name,
            mediaTypeIds: ids
          });

          this.selectedMediaTypes.set(ids);
          this.genreId = id;
        },
        error: (err) => {
          console.error('Failed to fetch genre details', err);
          this.close();
        }
      });
    }
  }

  public close() {
    this.show.set(false);
    this.form.reset();
  }

  public onCancel() {
    this.cancel.emit();
    this.close();
  }

  public onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onCancel();
    }
  }

}
