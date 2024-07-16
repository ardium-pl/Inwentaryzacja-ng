import { Injectable, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { DefaultValuesService } from '../default-values.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  readonly defaultValues = inject(DefaultValuesService);

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

  // Column definitions for AG Grid
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
        isNaN(params.value) ? this.defaultValues.noTransactionData : params.value,
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
}


