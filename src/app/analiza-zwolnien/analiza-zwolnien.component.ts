import {Component, inject, computed} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
} from 'ag-grid-community'; // Column Definition Type Interface
import {CompanyDataStorageService} from '../company-data-storage.service';
import {TransactionDataStorageService} from '../transaction-data-storage.service';
import {DefaultValuesService} from '../default-values.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColumnDefService } from './col-defs';

@Component({
  selector: 'app-analiza-zwolnien',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './analiza-zwolnien.component.html',
  styleUrl: './analiza-zwolnien.component.scss',
})
export class AnalizaZwolnienComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly companyDataStorageService = inject(CompanyDataStorageService);

  readonly defaultValues = inject(DefaultValuesService);

  readonly columnDefService = inject(ColumnDefService);

  readonly companies = computed(() => this.companyDataStorageService.companies());


  // AG GRID SET UP
  // Default column definitions - global
  defaultColDef: ColDef = this.columnDefService.defaultColDef;

  // Column definitions for AG Grid
  colDefs: ColDef[] = this.columnDefService.colDefs;

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row.
    const updatedCompany = event.data;

    // In case user deleted all cell content - assign a default value
    // Currently only the numeric columns can be set to 'null' by clearing the cell content
    const transactionProperties: string[] = Object.keys(updatedCompany);
    for (let property of transactionProperties) {
      if (updatedCompany[property] === null) {
        updatedCompany[property] = this.defaultValues.noContentAfterEdit;
      }
    }

    // Update the comapnies data stored in a signal wthin a service.
    this.companyDataStorageService.updateCompanies(updatedCompany);
  }
}
