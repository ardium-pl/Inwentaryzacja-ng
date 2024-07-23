import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { CompanyDataStorageService } from '../company-data-storage.service';
import { DEFAULT_VALUES } from '../default-values';
import { Transaction } from '../transaction';
import { Company } from '../company';
import { parse } from 'csv-parse/browser/esm';
import { ColorToggleComponent } from '../color-toggle/color-toggle.component';
import { NgIf } from '@angular/common'; // Import parsera CSV
import { FooterService } from '../footer.service';

@Component({
  selector: 'app-input-page',
  standalone: true,
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.scss'],
  imports: [ColorToggleComponent, NgIf],
})
export class InputPageComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly footerService = inject(FooterService);

  readonly companyDataStorageService = inject(CompanyDataStorageService);

  readonly router = inject(Router);

  readonly DEFAULT_VALUES = DEFAULT_VALUES;

  transactions: Transaction[] = [];
  manualAnalysisRequired: boolean = false;

  onPaste(event: ClipboardEvent): void {
    const { clipboardData } = event;
    const pastedText = clipboardData?.getData('text') || '';
    this.processDataPasted(pastedText);
    this.manualAnalysisRequired = true;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.classList.add('drag-over');
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    const element = event.target as HTMLElement;
    element.classList.remove('drag-over');
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.readFile(files[0], true);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.readFile(input.files[0], true);
    }
  }

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
            'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
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
          year:
            record['Rok którego ma dotyczyć dokumentacja'] ||
            DEFAULT_VALUES.NO_DATA,
          sellerName:
            record['Nazwa sprzedawcy/pożyczkodawcy/emitenta'] ||
            DEFAULT_VALUES.NO_DATA,
          buyerName:
            record['Nazwa odbiorcy/pożyczkobiorcy'] || DEFAULT_VALUES.NO_DATA,
          transactionType:
            record['Rodzaj transakcji'] || DEFAULT_VALUES.NO_TRANSACTION_DATA,
          transactionSubject:
            record['Nazwa/przedmiot transakcji'] || DEFAULT_VALUES.NO_DATA,
          netValue:
            parseFloat(
              record[
                'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
              ]
            ) || DEFAULT_VALUES.NO_DATA_NUMERIC,
          currency: record['Waluta'] || DEFAULT_VALUES.NO_DATA,
          loanDate:
            record['Data udzielenia pożyczki/gwarancji'] ||
            DEFAULT_VALUES.NO_DATA,
          interestRate:
            Number(
              record['Oprocentowanie (w przypadku transakcji finansowych)']
            ) || DEFAULT_VALUES.NO_DATA_NUMERIC,
          repaymentDate:
            record['Data spłaty (w przypadku transakcji finansowych)'] ||
            DEFAULT_VALUES.NO_DATA,
          significanceLimit: 0,
          homogeneousTransactionValue:
            // Defaultowo to samo co w kolumnie "netValue"
            parseFloat(
              record[
                'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
              ]
            ) || DEFAULT_VALUES.NO_DATA_NUMERIC,
          taxExemption: record['Zwolnienie art. 11n CIT'] || 'NIE',
          documentationRequirement: record['Obowiązek dokumentacji'] || 'NIE',
          benchmarkRequirement: record['Obowiązek benchmarku'] || 'NIE',
          tpr: record['TPR'] || 'NIE',
          selection: 'none',
          displayColor_seller: 'none',
          displayBold_seller: false,
          displayColor_buyer: 'none',
          displayBold_buyer: false,
        }));

        // Log the transactions for debugging
        // console.log(this.transactions);

        if (autoAnalyze) {
          this.analyzeData();
        }
      }
    );
  }

  processDataPasted(data: string): void {
    const rows = data.trim().split('\n');
    const startIndex = rows.findIndex((row) => row.includes('Transakcja'));
    const transactionRows = startIndex !== -1 ? rows.slice(startIndex + 1) : [];

    if (transactionRows.length === 0) {
      console.error('No transaction data found');
      return;
    }

    // this.transactions = transactionRows.map((row, index) => {
    //   const columns = row.split('\t').map((col) => col.trim());
    //   const parseValue = (value: string) =>
    //     value ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : 0;
    //
    //   return {
    //     transactionId: `${index + 1}`,
    //     year: columns[1] || '',
    //     sellerName: columns[2] || '',
    //     buyerName: columns[3] || '',
    //     transactionType: columns[4] || '',
    //     transactionSubject: columns[5] || '',
    //     netValue: parseValue(columns[6]),
    //     currency: columns[7] || '',
    //     loanDate: columns[8] || '',
    //     interestRate: columns[9] || 0,
    //     repaymentDate: columns[10] || '',
    //     significanceLimit: parseValue(columns[11]),
    //     homogeneousTransactionValue: parseValue(columns[12]),
    //     taxExemption: columns[13] || '',
    //     documentationRequirement: columns[14] || '',
    //     benchmarkRequirement: columns[15] || '',
    //     tpr: columns[16] || '',
    //     selection: 'none',
    //     displayColor_seller: 'none',
    //     displayBold_seller: false,
    //     displayColor_buyer: 'none',
    //     displayBold_buyer: false,
    //   } as Transaction;
    // });

    this.transactions = transactionRows.map((row, index) => {
      const columns = row.split('\t').map((col) => col.trim());
      return {
        transactionId: `${index + 1}`,
        year: columns[1] || DEFAULT_VALUES.NO_DATA,
        sellerName: columns[2] || DEFAULT_VALUES.NO_DATA,
        buyerName: columns[3] || DEFAULT_VALUES.NO_DATA,
        transactionType: columns[4] || DEFAULT_VALUES.NO_TRANSACTION_DATA,
        transactionSubject: columns[5] || DEFAULT_VALUES.NO_DATA,
        netValue: this.parseValue(columns[6]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        currency: columns[7] || DEFAULT_VALUES.NO_DATA,
        loanDate: columns[8] || DEFAULT_VALUES.NO_DATA,
        interestRate: Number(columns[9]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        repaymentDate: columns[10] || DEFAULT_VALUES.NO_DATA,
        significanceLimit: this.parseValue(columns[11]),
        homogeneousTransactionValue:
          this.parseValue(columns[12]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        taxExemption: columns[13] || 'NIE',
        documentationRequirement: columns[14] || 'NIE',
        benchmarkRequirement: columns[15] || 'NIE',
        tpr: columns[16] || 'NIE',
        selection: 'none',
        displayColor_seller: 'none',
        displayBold_seller: false,
        displayColor_buyer: 'none',
        displayBold_buyer: false,
      } as Transaction;
    });

    // console.log('Processed Transactions:', this.transactions);
  }

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
        transactionId: `${index + 1}`,
        year: columns[1] || DEFAULT_VALUES.NO_DATA,
        sellerName: columns[2] || DEFAULT_VALUES.NO_DATA,
        buyerName: columns[3] || DEFAULT_VALUES.NO_DATA,
        transactionType: columns[4] || DEFAULT_VALUES.NO_TRANSACTION_DATA,
        transactionSubject: columns[5] || DEFAULT_VALUES.NO_DATA,
        netValue: this.parseValue(columns[6]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        currency: columns[7] || DEFAULT_VALUES.NO_DATA,
        loanDate: columns[8] || DEFAULT_VALUES.NO_DATA,
        interestRate: Number(columns[9]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        repaymentDate: columns[10] || DEFAULT_VALUES.NO_DATA,
        significanceLimit: this.parseValue(columns[11]),
        homogeneousTransactionValue:
          this.parseValue(columns[12]) || DEFAULT_VALUES.NO_DATA_NUMERIC,
        taxExemption: columns[13] || 'NIE',
        documentationRequirement: columns[14] || 'NIE',
        benchmarkRequirement: columns[15] || 'NIE',
        tpr: columns[16] || 'NIE',
        selection: 'none',
        displayColor_seller: 'none',
        displayBold_seller: false,
        displayColor_buyer: 'none',
        displayBold_buyer: false,
      } as Transaction;
    });

    // Log the transactions for debugging
    // console.log(this.transactions);
  }

  private parseValue(value: string): number {
    return value ? parseFloat(value.replace(/\s/g, '').replace(',', '.')) : 0;
  }

  analyzeData(): void {
    if (this.transactions.length > 0) {
      // console.log('Analyzing data...');

      // Extract unique company names (if provided)
      const uniqueCompanyNames = new Set<string>();
      this.transactions.forEach((transaction) => {
        if (transaction.sellerName !== DEFAULT_VALUES.NO_DATA) {
          uniqueCompanyNames.add(transaction.sellerName);
        }
        if (transaction.buyerName !== DEFAULT_VALUES.NO_DATA) {
          uniqueCompanyNames.add(transaction.buyerName);
        }
      });

      // Create Company objects for each unique company name
      let companyId = 1;
      let companies: Company[] = Array.from(uniqueCompanyNames).map(
        (companyName) => ({
          companyId: companyId++,
          A_entityName: companyName,
          B_dctExemptionAllSources: 'NIE',
          C_dctExemptionCapitalSource: 'NIE',
          D_dctExemptionOtherSources: 'NIE',
          E_benchmarkExemptionSmallMicro: 'NIE',
          F_masterFileObligation: 'NIE',
          G_covidExemption: 'NIE',
          H_taxProfitLossCapitalSources2023: 0,
          I_taxProfitLossOtherSources2023: 0,
          J_pitCITExemption2023: 'NIE',
          K_consolidationReport: 'NIE',
          L_consolidatedRevenue2022: 0,
          M_averageEmployment2022: 0,
          N_netAnnualTurnover2022: 0,
          O_totalAssets2022: 0,
          P_employmentBelow10: 'NIE',
          Q_turnoverBelow2M_EUR: 'NIE',
          R_totalAssetsBelow2M_EUR: 'NIE',
          S_qualification: 'NIE',
          T_employmentBelow50: 'NIE',
          U_turnoverBelow10M_EUR: 'NIE',
          V_totalAssetsBelow10M_EUR: 'NIE',
          W_qualification: 'NIE',
          X_totalRevenue2022: 0,
          Y_totalRevenue2023: 0,
          displayColor: 'none',
          displayBold: false,
        })
      );

      // Set up transactions signal
      this.transactionDataStorageService.setTransactions(this.transactions);
      this.transactionDataStorageService.setAllTransactionLimits();
      // Set up companies signal
      this.companyDataStorageService.setCompanies(companies);
      // Conduct Analiza zwolnień and apply font styling to companies & transactions
      companies.forEach((inputCompany) =>
        this.companyDataStorageService.updateCompanies(inputCompany)
      );

      this.router.navigate(['/material-tabs-test']);
    } else {
      // console.log('No data to analyze');
    }
  }

  get hasData(): boolean {
    return this.transactions.length > 0;
  }

  constructor() {}
}
