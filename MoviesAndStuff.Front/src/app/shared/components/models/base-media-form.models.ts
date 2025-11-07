import { FormControl } from '@angular/forms';

/**
 * This defines all the text, routing, and icon settings specific to a media type (e.g., Movie, Game).
 */
export interface MediaFormConfig {
  mediaTypeId: string;
  routePrefix: string;
  icon: string;
  singularName: string;
  createEmoji: string;
  updateEmoji: string;
  statusProperty: string;
  statusLabel: string;
  dateProperty: string;
  dateLabel: string;
}

/**
 * Defines which fields are active for a specific media form.
 * Each media type must provide an instance of this config.
 */
export interface FormFieldConfig {
  title: boolean;
  review: boolean;
  genre: boolean;
  rating: boolean;
  statusDate: boolean;
  statusCheckbox: boolean;

  /** Allows custom fields to be toggled by media type. */
  [key: string]: boolean;
}

/**
 * This is the minimum set of properties shared across all media forms.
 */
export interface BaseMediaFormValue {
  title: string;
  review?: string;
  genreId: number | null;
  rating?: number;
  isStatus: boolean;
  statusDate?: Date;
}

/**
 * This merges the common base controls with any media-specific custom controls (`T`).
 */
export type MediaFormControls<T = any> = {
  title: FormControl<string>;
  review: FormControl<string>;
  genreId: FormControl<number | null>;
  rating: FormControl<number>;
  isStatus: FormControl<boolean>;
  statusDate: FormControl<Date>;
} & T;
