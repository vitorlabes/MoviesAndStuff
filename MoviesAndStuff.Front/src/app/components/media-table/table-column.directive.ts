import { Directive, input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTableColumn]',
  standalone: true
})
export class TableColumnDirective<T = any> {
  public header = input.required<string>();
  public width = input<string>(); // Aceita % ou px
  public headerClass = input<string>(''); // Classes Bootstrap para header
  public cellClass = input<string>(''); // Classes Bootstrap para células

  constructor(public template: TemplateRef<{ $implicit: T; index: number }>) { }
}
