import { Component, ElementRef, HostListener, OnDestroy, inject, input, output, viewChild, signal, effect, computed } from '@angular/core';
import { DropdownOption } from './models/dropdown';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnDestroy {
  private _eleRef = inject(ElementRef);

  // Inputs
  public options = input<DropdownOption[]>([]);
  public selectedValue = input<any>(null);
  public placeholder = input<string>('select an option');
  public label = input<string>('');
  public searchable = input<boolean>(true);
  public disabled = input<boolean>(false);
  public multiple = input<boolean>(false);

  // Outputs
  public selectionChange = output<any>();
  public searchChange = output<any>();

  // ViewChild
  public searchInput = viewChild.required<ElementRef>('searchInput');
  public dropdownSearchInput = viewChild<ElementRef>('dropdownSearchInput');

  // States (signals)
  public isOpen = signal(false);
  public searchTerm = signal('');
  public highlightedIndex = signal(-1);

  // Computed signals
  public filteredOptions = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const opts = this.options();

    if (!term) {
      return opts;
    }

    return opts.filter(option =>
      option.label.toLowerCase().includes(term)
    );
  });

  public displayValue = computed(() => {
    const selected = this.options().find(opt => opt.value === this.selectedValue());
    return selected ? selected.label : '';
  });

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private clickedInside = false;

  constructor() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.searchChange.emit(term);
    });

    effect(() => {
      this.filteredOptions();
      if (this.highlightedIndex() >= this.filteredOptions().length) {
        this.highlightedIndex.set(-1);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.searchSubject.complete();
  }

  toggleDropdown(event: Event) {
    if (this.disabled()) return;

    event.stopPropagation();
    this.clickedInside = true;

    if (this.isOpen()) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  openDropdown() {
    if (this.disabled()) return;

    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    this.searchTerm.set('');

    setTimeout(() => {
      if (this.searchable() && this.dropdownSearchInput()) {
        this.dropdownSearchInput()?.nativeElement.focus();
      }
    }, 0);
  }

  closeDropdown() {
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.highlightedIndex.set(-1);
  }

  onSearchInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;
    this.searchTerm.set(value);
    this.searchSubject.next(value);
  }

  onKeyDown(event: KeyboardEvent) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.navigateOptions(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.navigateOptions(-1);
        break;
      case 'Enter':
        event.preventDefault();
        if (this.isOpen() && this.highlightedIndex() >= 0) {
          const option = this.filteredOptions()[this.highlightedIndex()];
          if (option && !option.disabled) {
            this.selectOption(option, event as any);
          }
        }
        break;
      case 'Escape':
        this.closeDropdown();
        if (this.searchInput()) {
          this.searchInput().nativeElement.blur();
        }
        break;
    }
  }

  navigateOptions(direction: number) {
    if (!this.isOpen()) {
      this.openDropdown();
      return;
    }

    const maxIndex = this.filteredOptions().length - 1;

    if (maxIndex < 0) return;

    if (direction > 0) {
      this.highlightedIndex.set(
        this.highlightedIndex() < maxIndex ? this.highlightedIndex() + 1 : 0
      );
    } else {
      this.highlightedIndex.set(
        this.highlightedIndex() > 0 ? this.highlightedIndex() - 1 : maxIndex
      );
    }
  }

  selectOption(option: DropdownOption, event: MouseEvent | KeyboardEvent) {
    if (option.disabled) return;

    event.stopPropagation();

    this.selectionChange.emit(option.value);
    this.closeDropdown();

    setTimeout(() => {
      if (this.searchInput()) {
        this.searchInput().nativeElement.focus();
      }
    }, 0);
  }

  isSelected(option: DropdownOption): boolean {
    return this.selectedValue() === option.value;
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick(event: Event) {
    if (!this._eleRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }
}
