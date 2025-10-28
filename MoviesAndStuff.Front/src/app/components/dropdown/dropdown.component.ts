import { Component, ElementRef, HostListener, OnDestroy, OnInit, inject, input, output, viewChild, signal, effect } from '@angular/core';
import { DropdownOption } from './models/dropdown';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit, OnDestroy {
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
  public dropdownSearchInput = viewChild.required<ElementRef>('dropdownSearchInput');

  // States
  public isOpen = signal(false);
  public searchTerm = signal('');
  public filteredOptions = signal<DropdownOption[]>([]);
  public highlightedIndex = signal(-1);
  public displayValue = signal('');

  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();
  private clickedInside = false;
  private clickInside = false;

  constructor() {
    effect(() => {
      this.filteredOptions.set([...this.options()]);
      this.updateDisplayValue();
    });

    effect(() => {
      this.updateDisplayValue();
    });
  }

  ngOnInit(): void {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(term => {
      this.filterOptions(term);
      this.searchChange.emit(term);
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

  handleDocumentClick = (event: Event) => {
    if (!this._eleRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    if (this.disabled()) return;

    this.isOpen.set(true);
    this.highlightedIndex.set(-1);
    this.filteredOptions.set([...this.options()]);

    setTimeout(() => {
      if (this.searchable() && this.dropdownSearchInput()) {
        this.dropdownSearchInput().nativeElement.focus();
      }
    }, 0);
  }

  closeDropdown() {
    this.isOpen.set(false);
    this.searchTerm.set('');
    this.highlightedIndex.set(-1);
  }

  onWrapperClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.clickedInside = true;

    if (this.disabled()) return;

    if (!this.isOpen()) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  onInputFocus() {
    if (!this.clickedInside && !this.isOpen()) {
      this.openDropdown();
    }
    this.clickedInside = false;
  }

  onInputBlur() {
    setTimeout(() => {
      if (!this.clickedInside) {
        this.closeDropdown();
      }
      this.clickedInside = false;
    }, 200);
  }

  onDropdownMouseDown() {
    this.clickedInside = true;
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

  selectOption(option: DropdownOption, event: MouseEvent) {
    if (option.disabled) return;

    event.stopPropagation();

    this.selectionChange.emit(option.value);
    this.closeDropdown();

    if (this.searchInput()) {
      this.searchInput().nativeElement.focus();
    }
  }

  isSelected(option: DropdownOption) {
    return this.selectedValue() === option.value;
  }

  private filterOptions(term: string) {
    if (!term.trim()) {
      this.filteredOptions.set([...this.options()]);
    } else {
      this.filteredOptions.set(
        this.options().filter(option =>
          option.label.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
    this.highlightedIndex.set(-1);
  }

  private updateDisplayValue() {
    const selected = this.options().find(opt => opt.value === this.selectedValue());
    this.displayValue.set(selected ? selected.label : '');
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick() {
    if (!this.clickInside && this.isOpen()) {
      this.closeDropdown();
    }
    this.clickInside = false;
  }
}
