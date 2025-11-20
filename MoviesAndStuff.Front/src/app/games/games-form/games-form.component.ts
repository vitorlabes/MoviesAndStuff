import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BaseMediaFormComponent } from '../../shared/components/base-media-form/base-media-form.component';
import { GamesService } from '../services/games.service';
import { GameDetailDto } from '../dtos/game-detail-dto';
import { CreateGameDto } from '../dtos/game-create-dto';
import { UpdateGameDto } from '../dtos/game-update-dto';
import { MediaFormConfig } from '../../shared/components/models/base-media-form.models';
import { DropdownComponent } from '../../shared/components/ui/dropdown/dropdown.component';
import { StarRatingComponent } from '../../shared/components/ui/star-rating/star-rating.component';

@Component({
  selector: 'app-games-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DropdownComponent,
    StarRatingComponent
  ],
  templateUrl: './games-form.component.html',
  styleUrl: '../../shared/components/base-media-form/base-media-form.component.scss'
})
export class GamesFormComponent extends BaseMediaFormComponent<GameDetailDto, CreateGameDto, UpdateGameDto> {
  protected readonly config: MediaFormConfig = {
    mediaTypeId: 'GAME',
    routePrefix: '/games',
    icon: 'bi-controller',
    singularName: 'Game',
    createEmoji: '🎮',
    updateEmoji: '✨',
    statusProperty: 'isPlayed',
    statusLabel: 'Played',
    dateProperty: 'playDate',
    dateLabel: 'Play Date'
  };

  private readonly gamesService = inject(GamesService);

  protected readonly form = new FormGroup({
    title: new FormControl<string>('', Validators.required),
    review: new FormControl<string>(''),
    developer: new FormControl<string>(''),
    genreId: new FormControl<number | null>(0, Validators.required),
    rating: new FormControl<number>(0),
    releaseDate: new FormControl<Date>(new Date()),
    playDate: new FormControl<Date>(new Date()),
    isPlayed: new FormControl<boolean>(false)
  });

  protected get gameForm() {
    return this.form;
  }

  protected loadItemById(id: number): Observable<GameDetailDto> {
    return this.gamesService.getGameById(id);
  }

  protected patchFormWithItem(game: GameDetailDto): void {
    this.form.patchValue({
      title: game.title,
      review: game.review,
      developer: game.developer,
      genreId: game.genreId,
      rating: game.rating,
      releaseDate: game.releaseDate ? new Date(game.releaseDate) : new Date(),
      playDate: game.playDate ? new Date(game.playDate) : new Date(),
      isPlayed: game.isPlayed ?? false
    });
    this.selectedGenre.set(game.genreId ?? null);
  }

  protected mapFormToCreateDto(): CreateGameDto {
    const form = this.form.value;
    return {
      title: form.title!,
      review: form.review || undefined,
      developer: form.developer || undefined,
      genreId: this.selectedGenre() || undefined,
      rating: form.rating || undefined,
      releaseDate: form.releaseDate || undefined,
      playDate: form.playDate || undefined,
      isPlayed: form.isPlayed ?? false
    };
  }

  protected mapFormToUpdateDto(): UpdateGameDto {
    const form = this.form.value;
    return {
      title: form.title!,
      review: form.review || undefined,
      developer: form.developer || undefined,
      genreId: this.selectedGenre() || undefined,
      rating: form.rating || undefined,
      releaseDate: form.releaseDate || undefined,
      playDate: form.playDate || undefined,
      isPlayed: form.isPlayed ?? false
    };
  }

  protected createItem(dto: CreateGameDto): Observable<any> {
    return this.gamesService.createGame(dto);
  }

  protected updateItem(id: number, dto: UpdateGameDto): Observable<any> {
    return this.gamesService.updateGame(id, dto);
  }

  protected get titleHasError(): boolean {
    return this.hasError('title');
  }

  protected saveGame(): void {
    this.saveItem();
  }
}
