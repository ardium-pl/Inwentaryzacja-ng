import { Component, inject, HostListener, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionDataStorageService } from '../transaction-data-storage.service';

@Component({
  selector: 'app-color-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './color-toggle.component.html',
  styleUrls: ['./color-toggle.component.scss'],
})
export class ColorToggleComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly clearColors = output<void>();

  readonly isColorMenuVisible = signal<boolean>(false);

  readonly COLOR_MAP: { [colorName: string]: string } = {
    'Pink': '#F8BBD0',
    'Light Blue': '#B3E5FC',
    'Light Green': '#C8E6C9',
    'Lemon': '#FFF9C4',
    'Lavender': '#D1C4E9',
    'Peach': '#FFCCBC',
    'Tea Green': '#F0F4C3',
    'Thistle': '#E1BEE7',
    'Misty Rose': '#FFCDD2',
    'Periwinkle': '#C5CAE9',
    'Light Cyan': '#B2EBF2',
    'Pale Green': '#DCEDC8',
    'Beige': '#FFECB3',
    'Light Grey': '#CFD8DC',
  };

  // Convert hex names to their corresponding color names
  get colorNames(): string[] {
    return Object.keys(this.COLOR_MAP);
  }

  toggleColorMenu(): void {
    this.isColorMenuVisible.set(!this.isColorMenuVisible());
  }

  closeColorMenu(): void {
    this.isColorMenuVisible.set(false);
  }

  selectColor(colorName: string): void {
    const hexCode = this.COLOR_MAP[colorName];
    if (hexCode) {
      this.transactionDataStorageService.currentSelection.set(hexCode);
    }
  }

  clearAllColors(): void {
    this.transactionDataStorageService.clearAllSelections();
    this.clearColors.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const colorPicker = (event.target as HTMLElement).closest('.color-picker');
    if (!colorPicker) {
      this.closeColorMenu();
    }
  }
}
