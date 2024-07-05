import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { CompanyDataStorageService } from '../company-data-storage.service';
import { Transaction } from '../transaction';
import { Company } from '../company';
import { parse } from 'csv-parse/browser/esm'; // Import parsera CSV

/**
 * InputPageComponent is a component that handles the input of transaction data.
 * It provides functionality for pasting data, dragging and dropping files, and selecting files from the file system.
 * It also parses the input data and stores it in the TransactionDataStorageService.
 */
@Component({
  selector: 'app-input-page',
  standalone: true,
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.css'],
})
export class InputPageComponent {
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );

  companyDataStorageService: CompanyDataStorageService = inject(
    CompanyDataStorageService
  );

  router: Router = inject(Router);
  transactions: Transaction[] = [];
  manualAnalysisRequired: boolean = false;

  /**
   * Handles the paste event and processes the pasted text.
   * @param {ClipboardEvent} event - The paste event.
   */
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text') || '';
    this.processDataPasted(pastedText);
    this.manualAnalysisRequired = true;
  }

  /**
   * Handles the drag over event and adds a class to the target element.
   * @param {DragEvent} event - The drag event.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.classList.add('drag-over');
  }

  /**
   * Handles the drag leave event and removes a class from the target element.
   * @param {DragEvent} event - The drag event.
   */
  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.classList.remove('drag-over');
  }

  /**
   * Handles the drop event and processes the dropped file.
   * @param {DragEvent} event - The drop event.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFile(files[0], true);
    }
  }

  /**
   * Handles the file selected event and processes the selected file.
   * @param {Event} event - The file selected event.
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readFile(input.files[0], true);
    }
  }

  /**
   * Reads the file and processes it if it's a valid CSV file.
   * @param {File} file - The file to be read.
   * @param {boolean} autoAnalyze - Whether to automatically analyze the data after reading.
   */
  readFile(file: File, autoAnalyze: boolean): void {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const text = e.target?.result as string;
        this.parseCSV(text, autoAnalyze);
      };
      reader.readAsText(file, 'UTF-8'); // Upewnij się, że plik jest odczytywany jako UTF-8
    } else {
      alert('Please select a valid CSV file.');
    }
  }

  /**
   * Parses the CSV data and stores the transactions.
   * @param {string} data - The CSV data to be parsed.
   * @param {boolean} autoAnalyze - Whether to automatically analyze the data after parsing.
   */
  parseCSV(data: string, autoAnalyze: boolean): void {
    type TransactionRecord = {
      'Rok którego ma dotyczyć dokumentacja': string;
      'Nazwa sprzedawcy/pożyczkodawcy/emitenta': string;
      'Nazwa odbiorcy/pożyczkobiorcy': string;
      'Rodzaj transakcji': string;
      'Nazwa/przedmiot transakcji': string;
      'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału': string;
      Waluta: string;
      'Data udzielenia pożyczki/gwarancji': string;
      'Oprocentowanie (w przypadku transakcji finansowych)': string;
      'Data spłaty (w przypadku transakcji finansowych)': string;
      'Limit istotności [PLN]': string;
      'Wartość transakcji kontrolowanej o charakterze jednorodnym [PLN]': string;
      'Zwolnienie art. 11n CIT': string;
      'Obowiązek dokumentacji': string;
      'Obowiązek benchmarku': string;
      TPR: string;
      selection: string;
    };

    parse(
      data,
      {
        delimiter: ',',
        columns: true,
        skip_empty_lines: true,
        trim: true,
        relax_quotes: true,
        bom: true,
        cast: (value, context) => {
          if (
            context.column ===
              'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału' &&
            typeof value === 'string'
          ) {
            return parseFloat(value.replace(/\s/g, '').replace(',', '.'));
          }
          return value;
        },
      },
      (err, records: TransactionRecord[]) => {
        if (err) {
          console.error('Error parsing CSV:', err);
          return;
        }

        // Filter out the first data row if it is a clarification row or similar
        const filteredRecords = records.slice(1); // This skips the first record

        this.transactions = filteredRecords.map((record, index) => ({
          transactionId: `${index + 1}`, // Adjust index to start from 1 after filtering
          year: record['Rok którego ma dotyczyć dokumentacja'] || '',
          sellerName: record['Nazwa sprzedawcy/pożyczkodawcy/emitenta'] || '',
          buyerName: record['Nazwa odbiorcy/pożyczkobiorcy'] || '',
          transactionType: record['Rodzaj transakcji'] || '',
          transactionSubject: record['Nazwa/przedmiot transakcji'] || '',
          netValue: parseFloat(
            record[
              'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
            ]
          ),
          currency: record['Waluta'] || '',
          loanDate: record['Data udzielenia pożyczki/gwarancji'] || '',
          interestRate:
            record['Oprocentowanie (w przypadku transakcji finansowych)'] || '',
          repaymentDate:
            record['Data spłaty (w przypadku transakcji finansowych)'] || '',
          significanceLimit: parseFloat(record['Limit istotności [PLN]']) || 0,
          homogeneousTransactionValue:
            parseFloat(
              record[
                'Wartość transakcji kontrolowanej o charakterze jednorodnym [PLN]'
              ]
            ) || 0,
          taxExemption: record['Zwolnienie art. 11n CIT'] || '',
          documentationRequirement: record['Obowiązek dokumentacji'] || '',
          benchmarkRequirement: record['Obowiązek benchmarku'] || '',
          tpr: record['TPR'] || '',
          selection: 'none',
        }));

        // Log the transactions for debugging
        console.log(this.transactions);

        if (autoAnalyze) {
          this.analyzeData();
        }
      }
    );
  }

  /**
   * Processes the pasted data and stores the transactions.
   * @param {string} data - The pasted data.
   */
  processDataPasted(data: string): void {
    const rows = data.trim().split('\n');
    const startIndex = rows.findIndex((row) => row.includes('Transakcja'));
    const transactionRows = startIndex !== -1 ? rows.slice(startIndex + 1) : [];

    if (transactionRows.length === 0) {
      console.error('No transaction data found');
      return;
    }

    this.transactions = transactionRows.map((row, index) => {
      const columns = row.split('\t').map((col) => col.trim());
      const parseValue = (value: string) =>
        value ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : 0;

      return {
        transactionId: `${index + 1}`,
        year: columns[1] || '',
        sellerName: columns[2] || '',
        buyerName: columns[3] || '',
        transactionType: columns[4] || '',
        transactionSubject: columns[5] || '',
        netValue: parseValue(columns[6]),
        currency: columns[7] || '',
        loanDate: columns[8] || '',
        interestRate: columns[9] || '',
        repaymentDate: columns[10] || '',
        significanceLimit: parseValue(columns[11]),
        homogeneousTransactionValue: parseValue(columns[12]),
        taxExemption: columns[13] || '',
        documentationRequirement: columns[14] || '',
        benchmarkRequirement: columns[15] || '',
        tpr: columns[16] || '',
      } as Transaction;
    });

    console.log('Processed Transactions:', this.transactions);
  }

  /**
   * Processes the given data and stores the transactions.
   * @param {string} data - The data to be processed.
   */
  processData(data: string): void {
    const rows = data.trim().split('\n');
    const startIndex = rows.findIndex((row) => row.includes('Transakcja'));
    const transactionRows = startIndex !== -1 ? rows.slice(startIndex) : [];

    if (transactionRows.length === 0) {
      console.error('No transaction data found');
      return;
    }

    this.transactions = transactionRows.map((row, index) => {
      const columns = row.split('\t').map((col) => col.trim());
      return {
        transactionId: columns[0] || '',
        year: columns[1] || '',
        sellerName: columns[2] || '',
        buyerName: columns[3] || '',
        transactionType: columns[4] || '',
        transactionSubject: columns[5] || '',
        netValue: Number(columns[6]),
        currency: columns[7] || '',
        loanDate: columns[8] || '',
        interestRate: columns[9] || '',
        repaymentDate: columns[10] || '',
        significanceLimit: Number(columns[11]) || 0,
        homogeneousTransactionValue: Number(columns[12]) || 0,
        taxExemption: columns[13] || '',
        documentationRequirement: columns[14] || '',
        benchmarkRequirement: columns[15] || '',
        tpr: columns[16] || '',
      } as Transaction;
    });

    // Log the transactions for debugging
    console.log(this.transactions);
  }

  /**
   * Analyzes the transaction data and stores it in the TransactionDataStorageService.
   * Extracts the unique companies involved in the transactions and stores them in the CompanyDataStorageService
   */
  analyzeData(): void {
    if (this.transactions.length > 0) {
      console.log('Analyzing data...');

      // Extract unique company names
      const uniqueCompanyNames = new Set<string>();
      this.transactions.forEach((transaction) => {
        uniqueCompanyNames.add(transaction.sellerName);
        uniqueCompanyNames.add(transaction.buyerName);
      });

      // Create Company objects for each unique company name
      let companyId = 1;
      const companies: Company[] = Array.from(uniqueCompanyNames).map(
        (companyName) => ({
          companyId: companyId++,
          entityName____________________A: companyName,
          dctExemptionAllSources________B: 'NIE',
          dctExemptionCapitalSource_____C: 'NIE',
          dctExemptionOtherSources______D: 'NIE',
          benchmarkExemptionSmallMicro__E: 'NIE',
          masterFileObligation___________F: 'NIE',
          covidExemption_________________G: 'NIE',
          taxProfitLossCapitalSources2023_H: 0,
          taxProfitLossOtherSources2023__I: 0,
          pitCITExemption2023____________J: 'NIE',
          consolidationReport____________K: 'TAK',
          consolidatedRevenue2022________L: 0,
          averageEmployment2022__________M: 0,
          netAnnualTurnover2022__________N: 0,
          totalAssets2022________________O: 0,
          employmentBelow10______________P: 'NIE',
          turnoverBelow2M_EUR____________Q: 'NIE',
          totalAssetsBelow2M_EUR_________R: 'NIE',
          qualification__________________S: 'NIE',
          employmentBelow50______________T: 'NIE',
          turnoverBelow10M_EUR___________U: 'NIE',
          totalAssetsBelow10M_EUR________V: 'NIE',
          qualification__________________W: 'NIE',
          totalRevenue2022_______________X: 0,
          totalRevenue2023_______________Y: 0,
        })
      );

      this.companyDataStorageService.setCompanies(companies);
      this.transactionDataStorageService.setTransactions(this.transactions);
      this.transactionDataStorageService.setAllTransactionLimits();
      this.router.navigate(['/material-tabs-test']);
    } else {
      console.log('No data to analyze');
    }
  }

  /**
   * Checks if there is any transaction data available.
   * @returns {boolean} - True if there is transaction data, false otherwise.
   */
  get hasData(): boolean {
    return this.transactions.length > 0;
  }

  constructor() {}
}
