import {
  Component,
  input,
  inject,
  computed,
} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
} from 'ag-grid-community';
import {Transaction} from '../transaction';
import {TransactionDataStorageService} from '../transaction-data-storage.service';
import {DefaultValuesService} from '../default-values.service';
import {CompanyDataStorageService} from '../company-data-storage.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ColorToggleComponent} from '../color-toggle/color-toggle.component';
import {ColumnDefService} from './col-defs';

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

  readonly defaultValues = inject(DefaultValuesService);

  readonly columnDefService = inject(ColumnDefService);

  // AG GRID SET UP
  protected gridApi!: GridApi;
  // Default column definitions - global
  defaultColDef: ColDef = this.columnDefService.defaultColDef;

  // Default column definitions for text columns
  defaultTextColDef: ColDef = this.columnDefService.defaultTextColDef;

  // Default column definitions for numeric columns
  defaultNumericColDef: ColDef = this.columnDefService.defaultNumericColDef;

  // Column definitions for AG Grid
  colDefs: ColDef[] = this.columnDefService.colDefs;

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
        const updatedTransaction = {...transaction};

        // If transaction.selection !== 'none' (if transaction is marked with color)
        // set transaction.homogeneousTransactionValue to be the sum
        if (transaction.selection !== 'none') {
          updatedTransaction.homogeneousTransactionValue = selectionMap.get(
            transaction.selection
          ) as number;
        }

          // If transaction.selection === 'none' set transaction.homogeneousTransactionValue
        // to transaction.netValue
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
    // Currently only the numeric columns can be set to 'null' by clearing the cell content
    const transactionProperties: string[] = Object.keys(updatedTransaction);
    for (let property of transactionProperties) {
      if (updatedTransaction[property] === null) {
        updatedTransaction[property] = this.defaultValues.noContentAfterEdit;
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

    // Update the transactions data stored in a signal wthin a service.
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
      return {backgroundColor: params.data.selection};
    }
    return undefined;
  };
}
