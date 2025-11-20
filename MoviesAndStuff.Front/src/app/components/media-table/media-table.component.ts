import { Component, input, output, contentChildren } from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { TableColumnDirective } from './table-column.directive';

@Component({
  selector: 'app-media-table',
  standalone: true,
  imports: [CommonModule, NgTemplateOutlet],
  templateUrl: './media-table.component.html',
  styleUrls: ['./media-table.component.scss']
})
export class MediaTableComponent<T extends { id: number }> {
  public items = input.required<T[]>();
  public isLoading = input<boolean>(false);

  public columns = contentChildren(TableColumnDirective);

  public rowClick = output<T>();

  protected onRowClick(item: T): void {
    this.rowClick.emit(item);
  }

  protected trackByFn(index: number, item: T): number {
    return item.id;
  }
}
