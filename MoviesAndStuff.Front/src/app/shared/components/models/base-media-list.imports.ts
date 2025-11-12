import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DropdownComponent } from '../../../components/dropdown/dropdown.component';
import { ConfirmModalComponent } from '../../../components/confirm-modal/confirm-modal.component';
import { MediaTableComponent } from '../../../components/media-table/media-table.component';
import { TableColumnDirective } from '../../../components/media-table/table-column.directive';

export const BASE_MEDIA_LIST_IMPORTS = [
  CommonModule,
  ReactiveFormsModule,
  DropdownComponent,
  ConfirmModalComponent,
  MediaTableComponent,
  TableColumnDirective
] as const;
