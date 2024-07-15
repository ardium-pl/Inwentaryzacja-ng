import { Component, Input, input, Signal, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
} from 'ag-grid-community'; // Column Definition Type Interface
import { Transaction } from '../transaction';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { DefaultValuesService } from '../default-values.service';
import { CompanyDataStorageService } from '../company-data-storage.service';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';
import { ColorToggleComponent } from '../color-toggle/color-toggle.component';

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

  readonly companyDataStorageService = inject(
    CompanyDataStorageService
  );

  readonly defaultValues = inject(DefaultValuesService);

  // GRID SETTINGS

  // Default column definitions - global
  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerClass: 'grid-header',
    width: 250,
  };

  // Default column definitions for text columns
  defaultTextColDef: ColDef = {
    cellStyle: (params: any) => {
      const styles: any = {};

      if (params.value === this.defaultValues.noData) {
        styles.color = 'red';
      }

      if (params.value === 'TAK') {
        styles.backgroundColor = 'lightgreen';
        styles.color = 'darkgreen';
        styles.textAlign = 'center';
      } else if (params.value === 'NIE') {
        styles.backgroundColor = 'lightcoral';
        styles.color = 'darkred';
        styles.textAlign = 'center';
      }

      return styles;
    },
  };

  // Default column definitions for numeric columns
  defaultNumericColDef: ColDef = {
    cellStyle: (params: any) => {
      if (isNaN(params.value)) {
        return { color: 'red' };
      } else {
        return undefined;
      }
    },
    cellRenderer: (params: any) =>
      isNaN(params.value) ? this.defaultValues.noData : params.value,
  };

  /**
   * Column definitions for the AG Grid.
   */
  colDefs: ColDef[] = [
    {
      headerName: 'ID Transakcji',
      field: 'transactionId',
      editable: false,
      cellDataType: 'number',
      ...this.defaultNumericColDef,
    },
    {
      headerName: 'Rok którego ma dotyczyć dokumentacja',
      field: 'year',
      editable: false,
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Nazwa sprzedawcy/pożyczkodawcy/emitenta',
      field: 'sellerName',
      editable: false,
      cellDataType: 'text',
      cellStyle: (params) => {
        const styles: any = {};

        // Set text color if displayColor_seller is not 'none'
        if (params.data.displayColor_seller !== 'none') {
          styles.color = params.data.displayColor_seller;
        }

        // Set text to bold if displayBold_seller is true
        if (params.data.displayBold_seller) {
          styles.fontWeight = 'bold';
        }

        if (params.value === this.defaultValues.noData) {
          return { color: 'red' };
        }

        return styles;
      },
    },
    {
      headerName: 'Nazwa odbiorcy/pożyczkobiorcy',
      field: 'buyerName',
      editable: false,
      cellDataType: 'text',
      cellStyle: (params) => {
        const styles: any = {};

        // Set text color if displayColor_buyer is not 'none'
        if (params.data.displayColor_buyer !== 'none') {
          styles.color = params.data.displayColor_buyer;
        }

        // Set text to bold if displayBold_buyer is true
        if (params.data.displayBold_buyer) {
          styles.fontWeight = 'bold';
        }

        if (params.value === this.defaultValues.noData) {
          return { color: 'red' };
        }

        return styles;
      },
    },
    {
      headerName: 'Rodzaj transakcji',
      field: 'transactionType',
      editable: true,
      cellDataType: 'text',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: [
          'Transakcja towarowa',
          'Transakcja finansowa',
          'Transakcja usługowa',
          'Transakcje "rajowe" finansowe',
          'Transakcje "rajowe" inne niż finansowe',
        ],
      },
      cellStyle: (params: any) => {
        if (params.value === this.defaultValues.noTransactionData) {
          return { color: 'red', fontWeight: 'bold' };
        } else {
          return undefined;
        }
      },
    },
    {
      headerName: 'Nazwa/przedmiot transakcji',
      field: 'transactionSubject',
      editable: false,
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName:
        'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału',
      field: 'netValue',
      editable: true,
      cellDataType: 'number',
      ...this.defaultNumericColDef,
    },
    {
      headerName: 'Waluta',
      field: 'currency',
      editable: false,
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Data udzielenia pożyczki/gwarancji',
      field: 'loanDate',
      editable: false,
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Oprocentowanie (w przypadku transakcji finansowych)',
      field: 'interestRate',
      editable: true,
      cellDataType: 'number',
      ...this.defaultNumericColDef,
    },
    {
      headerName: 'Data spłaty (w przypadku transakcji finansowych)',
      field: 'repaymentDate',
      editable: false,
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Limit istotności [PLN]',
      field: 'significanceLimit',
      editable: false,
      cellDataType: 'number',
      // ...this.defaultNumericColDef,
      cellStyle: (params: any) => {
        if (isNaN(params.value)) {
          return { color: 'red', fontWeight: 'bold' };
        } else {
          return undefined;
        }
      },
      cellRenderer: (params: any) =>
        isNaN(params.value)
          ? this.defaultValues.noTransactionData
          : params.value,
    },
    {
      headerName:
        'Wartość transakcji kontrolowanej o charakterze jednorodnym [PLN]',
      field: 'homogeneousTransactionValue',
      editable: false,
      cellDataType: 'number',
      ...this.defaultNumericColDef,
    },
    {
      headerName: 'Zwolnienie art. 11n CIT',
      field: 'taxExemption',
      editable: false, // DOPYTAĆ - Dodać inf na podstawie Analizy Zwolnień
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Obowiązek dokumentacji',
      field: 'documentationRequirement',
      editable: false, // DOPYTAĆ - Dodać inf na podstawie Analizy Zwolnień
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'Obowiązek benchmarku',
      field: 'benchmarkRequirement',
      editable: false, // Dodać inf na podstawie Analizy Zwolnień
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
    {
      headerName: 'TPR',
      field: 'tpr',
      editable: false, // DOPYTAĆ - Dodać inf na podstawie Analizy Zwolnień
      cellDataType: 'text',
      ...this.defaultTextColDef,
    },
  ];


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

      // Update homogeneousTransactionValue based on the selection group sums
      return transactions.map((transaction) => {
        const updatedTransaction = { ...transaction };

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
  }

  // Receive companyName

  @Input() companyName!: string;
  @Input() permanentTab!: string;

  //   // If companyName is optional or can have a default value, use input with a default value
  // readonly companyName = input.required<string>();
  //
  // // If permanentTab is required to be provided by the parent component, use input.required
  // readonly permanentTab = input.required<string>();



  // Define row data

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

  onCellClicked(event: any) {
    // Apply selection only when Shift key is pressed
    if (event.event.shiftKey) {
      const selectedRow: Transaction = event.data;

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
      return { backgroundColor: params.data.selection };
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
