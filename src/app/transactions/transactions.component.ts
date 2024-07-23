import { Component, input, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
} from 'ag-grid-community';
import { Transaction } from '../transaction';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { DEFAULT_VALUES } from '../default-values';
import { CompanyDataStorageService } from '../company-data-storage.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColorToggleComponent } from '../color-toggle/color-toggle.component';
import { transactionColumnDefinitions } from './col-defs';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [AgGridAngular, ColorToggleComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly companyDataStorageService = inject(CompanyDataStorageService);

  readonly transactionColumnDefinitions = new transactionColumnDefinitions();

  // AG GRID SET UP
  protected gridApi!: GridApi;
  // Default column definitions - global
  defaultColDef: ColDef = this.transactionColumnDefinitions.defaultColDef;

  // Default column definitions for text columns
  defaultTextColDef: ColDef =
    this.transactionColumnDefinitions.defaultTextColDef;

  // Default column definitions for numeric columns
  defaultNumericColDef: ColDef =
    this.transactionColumnDefinitions.defaultNumericColDef;

  // Column definitions for AG Grid
  colDefs: ColDef[] = this.transactionColumnDefinitions.colDefs;

  readonly transactions = computed(() => {
    const transactions = this.transactionDataStorageService.transactions();
    const selectionMap = new Map<string, number>();

    // Calculate the sum of netValue for each selection group
    transactions.forEach((transaction) => {
      if (transaction.selection !== 'none') {
        if (!selectionMap.has(transaction.selection)) {
          selectionMap.set(transaction.selection, 0);
        }
        selectionMap.set(
          transaction.selection,
          selectionMap.get(transaction.selection)! + transaction.netValue
        );
      }
    });

    // Update homogeneousTransactionValue based on the selection group sums
    return transactions.map((transaction) => {
      const updatedTransaction = { ...transaction };

      // If transaction.selection !== 'none' (if transaction is marked with color) set transaction.homogeneousTransactionValue to be the sum
      if (transaction.selection !== 'none') {
        updatedTransaction.homogeneousTransactionValue = selectionMap.get(
          transaction.selection
        ) as number;
      }

      // If transaction.selection === 'none' set transaction.homogeneousTransactionValueto transaction.netValue
      else {
        updatedTransaction.homogeneousTransactionValue =
          updatedTransaction.netValue;
      }

      return updatedTransaction;
    });
  });

  // Receive companyName

  readonly companyName = input<string>('');
  readonly permanentTab = input<string>('');

  // Define row data

  readonly companyTransactions = computed(() => {
    if (this.permanentTab() === 'Transactions MAIN') {
      return this.transactions();
    } else if (this.permanentTab() === 'Obowiązki CT') {
      // Compute the minimum significanceLimit for each selection group
      const minSignificanceLimitMap = new Map<string, number>();

      this.transactions().forEach((transaction) => {
        if (transaction.selection !== 'none') {
          const currentLimit = minSignificanceLimitMap.get(
            transaction.selection
          );
          if (
            currentLimit === undefined ||
            transaction.significanceLimit < currentLimit
          ) {
            minSignificanceLimitMap.set(
              transaction.selection,
              transaction.significanceLimit
            );
          }
        }
      });

      // Filter transactions
      return this.transactions().filter(
        (transaction) =>
          transaction.selection !== 'none' &&
          transaction.homogeneousTransactionValue >
            minSignificanceLimitMap.get(transaction.selection)!
      );
    }

    // Filter transactions for the specified company
    return this.transactions().filter(
      (transaction) =>
        transaction.sellerName === this.companyName() ||
        transaction.buyerName === this.companyName()
    );
  });

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row.
    const updatedTransaction: Transaction = event.data;

    // In case user deleted all cell content - assign a default value
    if (event.newValue === null) {
      if (event.colDef.cellDataType === 'number') {
        updatedTransaction[event.colDef.field!] =
          DEFAULT_VALUES.NO_CONTENT_AFTER_EDIT_NUMERIC;
      } else if (event.colDef.cellDataType === 'text') {
        updatedTransaction[event.colDef.field!] =
          DEFAULT_VALUES.NO_CONTENT_AFTER_EDIT_TEXT;
      }
    }

    // Update taxExemption (Zwolnienie art. 11n CIT) column value if transactionType was changed
    if (
      event.colDef.field === 'transactionType' &&
      event.oldValue !== event.newValue
    ) {
      if (event.newValue !== 'Transakcja finansowa') {
        if (
          updatedTransaction.displayColor_buyer === '#FF6d01' ||
          updatedTransaction.displayColor_seller === '#FF6d01' ||
          updatedTransaction.displayColor_buyer === '#4CAF50' ||
          updatedTransaction.displayColor_seller === '#4CAF50'
        ) {
          updatedTransaction.taxExemption = 'TAK';
        } else {
          updatedTransaction.taxExemption = 'NIE';
        }
      } else if (event.newValue === 'Transakcja finansowa') {
        if (
          updatedTransaction.displayColor_buyer === '#4682B4' ||
          updatedTransaction.displayColor_seller === '#4682B4' ||
          updatedTransaction.displayColor_buyer === '#4CAF50' ||
          updatedTransaction.displayColor_seller === '#4CAF50'
        ) {
          updatedTransaction.taxExemption = 'TAK';
        } else {
          updatedTransaction.taxExemption = 'NIE';
        }
      }
    }

    // Update the rows limit
    const limit = this.transactionDataStorageService.LIMITS.get(
      updatedTransaction.transactionType
    );
    updatedTransaction.significanceLimit =
      limit !== undefined
        ? limit
        : this.transactionDataStorageService.INNA_LIMIT;

    // Update the transactions data stored in a signal within a service.
    this.transactionDataStorageService.updateTransactions(updatedTransaction);
  }

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // ROWS SELECTION

  onGridReady(event: GridReadyEvent) {
    // GridReadyEvent - The first event fired by the grid - can be used to store a reference to the api
    this.gridApi = event.api;
  }

  onCellClicked(event: any) {
    // Apply selection only when Shift key is pressed
    if (event.event.shiftKey) {
      const selectedRow: Transaction = event.data;

      // Toggle selection
      if (
        selectedRow.selection ===
        this.transactionDataStorageService.currentSelection()
      ) {
        selectedRow.selection = 'none';
      } else {
        selectedRow.selection =
          this.transactionDataStorageService.currentSelection();
      }
      this.transactionDataStorageService.updateTransactions(selectedRow);
    }
  }

  // Apply background color for the selected row
  getRowStyle = (params: any): RowStyle | undefined => {
    if (params.data.selection !== 'none') {
      return { backgroundColor: params.data.selection };
    }
    return undefined;
  };
}
