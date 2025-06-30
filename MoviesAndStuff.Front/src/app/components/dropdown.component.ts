import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { DropdownOption } from './models/dropdown';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-dropdown',
  imports: [],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss'
})
export class DropdownComponent implements OnInit, OnDestroy, OnChanges {
  constructor(
    private eleRef: ElementRef
  ) { }

  @Input() options: DropdownOption[] = [];
  @Input() selectedValue: any = null;
  @Input() placeholder: string = 'select an option';
  @Input() label: string = '';
  @Input() searchable: boolean = true;
  @Input() disabled: boolean = false;
  @Input() multiple: boolean = false;

  @Output() selectionChange = new EventEmitter<any>();
  @Output() searchChange = new EventEmitter<any>();

  @ViewChild('searchInput') searchInput!: ElementRef
  @ViewChild('dropdownSearchInput') dropdownSearchInput!: ElementRef

  isOpen = false;
  searchTerm = '';
  filteredOptions: DropdownOption[] = [];
  highlightedIndex = -1;
  displayValue = '';

  private searchSubject = new Subject<string>();
  private destroy = new Subject<void>();
  private clickedInside = false;
  private clickInside = false;

  ngOnInit(): void {
    this.filteredOptions = [...this.options];
    this.updateDisplayValue();

    this.searchSubject.pipe(debounceTime(300), distinctUntilChanged()).subscribe(term => {
      this.filterOptions(term);
      this.searchChange.emit(term);
    })
  }

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && changes['options'].currentValue) {
      this.filteredOptions = [...this.options];
      this.updateDisplayValue();
    }
  }

  toggleDropdown(event: Event) {
    if (this.disabled) return;

    event.stopPropagation();
    this.clickedInside = true;

    if (this.isOpen) {
      this.closeDropdown();
    } else {
      this.openDropdown();
    }
  }

  handleDocumentClick = (event: Event) => {
    if (!this.eleRef.nativeElement.contains(event.target)) {
      this.closeDropdown();
    }
  }

  openDropdown() {
    if (this.disabled) return;

    this.isOpen = true;
    this.highlightedIndex = -1;
    this.filteredOptions = [...this.options];

    setTimeout(() => {
      if (this.searchable && this.dropdownSearchInput) {
        this.dropdownSearchInput.nativeElement.focus();
      }
    }, 0);
  }

  closeDropdown() {
    this.isOpen = false;
    this.searchTerm = '';
    this.highlightedIndex = -1;
  }

  onWrapperClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.clickedInside = true;

    if (this.disabled) return;

    if (!this.isOpen) {
      this.openDropdown();
    } else {
      this.closeDropdown();
    }
  }

  onInputFocus() {
    if (!this.clickedInside && !this.isOpen) {
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
    this.searchTerm = value;
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
      // case 'Enter':
      //   event.preventDefault();
      //   if (this.highlightedIndex >= 0 && this.filteredOptions[this.highlightedIndex]) {
      //     this.selectOption(this.filteredOptions[this.highlightedIndex]);
      //   }
      //   break;
      case 'Escape':
        this.closeDropdown();
        if (this.searchInput) {
          this.searchInput.nativeElement.blur();
        }
        break;
    }
  }

  navigateOptions(direction: number) {
    if (!this.isOpen) {
      this.openDropdown();
      return;
    }

    const maxIndex = this.filteredOptions.length - 1;

    if (direction > 0) {
      this.highlightedIndex = this.highlightedIndex < maxIndex ? this.highlightedIndex + 1 : 0;
    } else {
      this.highlightedIndex = this.highlightedIndex > 0 ? this.highlightedIndex - 1 : maxIndex;
    }
  }

  selectOption(option: DropdownOption, event: MouseEvent) {
    if (option.disabled) return;

    event.stopPropagation();

    this.selectedValue = option.value;
    this.updateDisplayValue();
    this.selectionChange.emit(option.value);
    this.closeDropdown();

    if (this.searchInput) {
      this.searchInput.nativeElement.focus();
    }
  }

  isSelected(option: DropdownOption) {
    return this.selectedValue === option.value;
  }

  private filterOptions(term: string) {
    if (!term.trim()) {
      this.filteredOptions = [...this.options];
    } else {
      this.filteredOptions = this.options.filter(option => option.label.toLowerCase().includes(term.toLowerCase()));
    }
    this.highlightedIndex = -1;
  }

  private updateDisplayValue() {
    const selected = this.options.find(opt => opt.value === this.selectedValue);
    this.displayValue = selected ? selected.label : '';
  }

  @HostListener('document:click', ['$event'])
  handleOutsideClick() {
    if (!this.clickInside && this.isOpen) {
      this.closeDropdown();
    }
    this.clickInside = false;
  }
}
