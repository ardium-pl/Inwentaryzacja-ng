import {Component, inject, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {TransactionDataStorageService} from '../transaction-data-storage.service';


/**
 * The `ColorToggleComponent` provides functionality to select a color from a predefined list
 * and communicate this selection to other components. It also allows for clearing the selection.
 * This component is standalone and uses the `CommonModule`.
 */
@Component({
  selector: 'app-color-toggle',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatButtonModule],
  templateUrl: './color-toggle.component.html',
  styleUrls: ['./color-toggle.component.css'],
})
export class ColorToggleComponent {

  @Output() clearColors = new EventEmitter<void>();
  // Inject the data storage service
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );

  // Map of color names to hex codes
  colorMap: { [colorName: string]: string } = {
    "Pink": "#F8BBD0",
    "Light Blue": "#B3E5FC",
    "Light Green": "#C8E6C9",
    "Lemon": "#FFF9C4",
    "Lavender": "#D1C4E9",
    "Peach": "#FFCCBC",
    "Tea Green": "#F0F4C3",
    "Thistle": "#E1BEE7",
    "Misty Rose": "#FFCDD2",
    "Periwinkle": "#C5CAE9",
    "Light Cyan": "#B2EBF2",
    "Pale Green": "#DCEDC8",
    "Beige": "#FFECB3",
    "Light Grey": "#CFD8DC"
  };

  // Convert hex names to their corresponding color names
  get colorNames(): string[] {
    return Object.keys(this.colorMap);
  }

  // If needed, convert hex code to color name
  getColorNameByHex(hexCode: string): string {
    return Object.keys(this.colorMap).find(key => this.colorMap[key] === hexCode) || 'None selected';
  }

  /**
   * Selects a color and updates the current selection in the `TransactionDataStorageService`.
   * @param colorName The hex code of the color to be selected.
   */

  selectColor(colorName: string): void {
    const hexCode = this.colorMap[colorName];
    if (hexCode) {
      this.transactionDataStorageService.currentSelection = hexCode;
    }
  }

  /**
   * Clears all color selections by emitting the `clearColors` event. --> currently not used
   */
  clearAllColors(): void {
    this.transactionDataStorageService.clearAllSelections();
    this.clearColors.emit();
  }

  /**
   * Toggles the visibility of the dropdown menu.
   * This method selects the dropdown menu element by its class name ('.dropdown-menu')
   * and toggles the 'show' class to either show or hide the dropdown content.
   */
  toggleDropdown(): void {
    const dropdown = document.querySelector('.dropdown-menu');
    dropdown?.classList.toggle('show');
  }
}
