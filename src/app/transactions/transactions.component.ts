import {
  Component,
  Input,
  Signal,
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
} from 'ag-grid-community'; // Column Definition Type Interface
import {Transaction} from '../transaction';
import {TransactionDataStorageService} from '../transaction-data-storage.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import {ColorToggleComponent} from '../color-toggle/color-toggle.component';

// @ts-ignore
/**
 * TransactionsComponent is a component that displays and manages transaction data in an AG Grid.
 * It allows for editing of transaction fields and updates the transaction data in the storage service.
 */

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [AgGridAngular, ColorToggleComponent],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.css',
})
export class TransactionsComponent {
  // Inject the data storage service
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );
  // GRID SETTINGS
  /**
   * Default column definitions for AG Grid.
   */
  public defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerClass: 'grid-header',
    width: 250,
  };

  /**
   * Column definitions for the AG Grid.
   */
  colDefs: ColDef[] = [
    {
      headerName: 'ID Transakcji',
      field: 'transactionId',
      editable: true,
    },
    {
      headerName: 'Rok którego ma dotyczyć dokumentacja',
      field: 'year',
      editable: true,
    },
    {
      headerName: 'Nazwa sprzedawcy/pożyczkodawcy/emitenta',
      field: 'sellerName',
      editable: true,
    },
    {
      headerName: 'Nazwa odbiorcy/pożyczkobiorcy',
      field: 'buyerName',
      editable: true,
    },
    {
      headerName: 'Rodzaj transakcji',
      field: 'transactionType',
      editable: true,
    },
    {
      headerName: 'Nazwa/przedmiot transakcji',
      field: 'transactionSubject',
      editable: true,
    },
    {
      headerName:
        'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału',
      field: 'netValue',
      editable: true,
    },
    {headerName: 'Waluta', field: 'currency', editable: true},
    {
      headerName: 'Data udzielenia pożyczki/gwarancji',
      field: 'loanDate',
      editable: true,
    },
    {
      headerName: 'Oprocentowanie (w przypadku transakcji finansowych)',
      field: 'interestRate',
      editable: true,
    },
    {
      headerName: 'Data spłaty (w przypadku transakcji finansowych)',
      field: 'repaymentDate',
      editable: true,
    },
    {
      headerName: 'Limit istotności [PLN]',
      field: 'significanceLimit',
      editable: true,
    },
    {
      headerName:
        'Wartość transakcji kontrolowanej o charakterze jednorodnym [PLN]',
      field: 'homogeneousTransactionValue',
      editable: true,
    },
    {
      headerName: 'Zwolnienie art. 11n CIT',
      field: 'taxExemption',
      editable: true,
    },
    {
      headerName: 'Obowiązek dokumentacji',
      field: 'documentationRequirement',
      editable: true,
    },
    {
      headerName: 'Obowiązek benchmarku',
      field: 'benchmarkRequirement',
      editable: true,
    },
    {headerName: 'TPR', field: 'tpr', editable: true},
  ];

  /**
   * Signal containing the list of transactions.
   */
  transactions: Signal<Transaction[]>;

  constructor() {
    this.transactions = computed(() => {
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

      console.log('selectionMap:', Array.from(selectionMap.entries()));
      // Update homogeneousTransactionValue based on the selection group sums
      return transactions.map((transaction) => {
        const updatedTransaction = {...transaction};
        if (transaction.selection === 'none') {
          updatedTransaction.homogeneousTransactionValue = 0;
        } else {
          updatedTransaction.homogeneousTransactionValue =
            selectionMap.get(transaction.selection) || 0;
        }
        return updatedTransaction;
      });
    });
  }

  // Receive companyName
  /**
   * Input property for the company name to filter transactions.
   */
  @Input() companyName!: string;
  @Input() permanentTab!: string;

  // Define row data
  /**
   * Computed property to get transactions for the specified company.
   * If no company name is provided, it returns all transactions.
   */
  companyTransactions = computed(() => {
    if (this.permanentTab === 'Transactions MAIN') {
      return this.transactions();
    } else if (this.permanentTab === 'Obowiązki CT') {
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
        transaction.sellerName === this.companyName ||
        transaction.buyerName === this.companyName
    );
  });

  /**
   * Event handler for when a cell value changes in the grid.
   * @param {CellValueChangedEvent} event - The event containing the updated cell value.
   */
  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row.
    const updatedTransaction: Transaction = event.data;
    // Update the rows limit
    const limit = this.transactionDataStorageService.limits.get(
      updatedTransaction.transactionType
    );
    updatedTransaction.significanceLimit =
      limit !== undefined
        ? limit
        : this.transactionDataStorageService.inna_limit;
    // Reset homogeneousTransactionValue
    updatedTransaction.homogeneousTransactionValue = 0;

    console.log(updatedTransaction);
    // Update the transactions data stored in a signal wthin a service.
    this.transactionDataStorageService.updateTransactions(updatedTransaction);
  }

  //xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  // ROWS SELECTION
  private gridApi!: GridApi;
  rowSelection: 'single' | 'multiple' = 'single';
  shouldRun: boolean = true;
  selectedRowDisplay!: any;
  suppressRowClickSelection: boolean = true;
  suppressScrollOnNewData: boolean = true;

  onGridReady(event: GridReadyEvent) {
    // GridReadyEvent - The first event fired by the grid - can be used to store a reference to the api
    this.gridApi = event.api;
  }

  // onSelectionChanged() {
  //   console.log('Selection changed!');
  //   const selectedRow: Transaction = this.gridApi.getSelectedRows()[0];

  //   // Display only
  //   // this.selectedRowDisplay = selectedRow;
  //   // Display only

  //   // Update row background color
  //   if (this.shouldRun) {
  //     if (
  //       selectedRow.selection ===
  //       this.transactionDataStorageService.currentSelection
  //     ) {
  //       selectedRow.selection = 'none';
  //     } else {
  //       selectedRow.selection =
  //         this.transactionDataStorageService.currentSelection;
  //     }
  //     this.shouldRun = false;
  //     this.transactionDataStorageService.updateTransactions(selectedRow);
  //   }
  //   // Change flag
  //   else {
  //     this.shouldRun = true;
  //   }
  // }

  onCellClicked(event: any) {
    // Apply selection only when Ctrl key is pressed
    if (event.event.shiftKey) {
      const selectedRow: Transaction = event.data;

      // Display only
      this.selectedRowDisplay = selectedRow;
      // Display only

      // Toggle selection
      if (
        selectedRow.selection ===
        this.transactionDataStorageService.currentSelection
      ) {
        selectedRow.selection = 'none';
      } else {
        selectedRow.selection =
          this.transactionDataStorageService.currentSelection;
      }
      this.transactionDataStorageService.updateTransactions(selectedRow);
    }
  }

  getRowStyle = (params: any): RowStyle | undefined => {
    if (params.data.selection !== 'none') {
      return {backgroundColor: params.data.selection};
    }
    return undefined;
  };

  clearAllColorSelections(): void {
    this.transactionDataStorageService.clearAllSelections();
    if (this.gridApi) {
      this.gridApi.redrawRows();
    }
  }
}
