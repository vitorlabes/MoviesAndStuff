import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from '../ui/dropdown/dropdown.component';
import { ConfirmModalComponent } from '../ui/confirm-modal/confirm-modal.component';
import { MediaTableComponent } from '../ui/media-table/media-table.component';
import { TableColumnDirective } from '../ui/media-table/table-column.directive';
import { BadgeComponent } from '../ui/badge/badge.component';

export const BASE_MEDIA_LIST_IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  DropdownComponent,
  ConfirmModalComponent,
  MediaTableComponent,
  TableColumnDirective,
  BadgeComponent
] as const;
