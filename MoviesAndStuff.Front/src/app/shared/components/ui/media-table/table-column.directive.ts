import { Directive, inject, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTableColumn]',
  standalone: true
})
export class TableColumnDirective<T = any> {
  public header = input.required<string>();
  public width = input<string>(); // % or px
  public headerClass = input<string>(''); // Header bootstrap classes
  public cellClass = input<string>(''); // Cell eader bootstrap classes

  public readonly template = inject(TemplateRef<{ $implicit: T; index: number }>);
}
