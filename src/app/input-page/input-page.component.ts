import {Component, inject} from '@angular/core';
import {Router} from '@angular/router';
import {TransactionDataStorageService} from '../transaction-data-storage.service';
import {CompanyDataStorageService} from '../company-data-storage.service';
import {DefaultValuesService} from '../default-values.service';
import {Transaction} from '../transaction';
import {Company} from '../company';
import {parse} from 'csv-parse/browser/esm'; // Import parsera CSV


@Component({
  selector: 'app-input-page',
  standalone: true,
  templateUrl: './input-page.component.html',
  styleUrls: ['./input-page.component.scss'],
})
export class InputPageComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly companyDataStorageService = inject(
    CompanyDataStorageService
  );

  readonly defaultValues = inject(
    DefaultValuesService
  );

  readonly router = inject(
    Router
  );
  
  transactions: Transaction[] = [];
  manualAnalysisRequired: boolean = false;


  onPaste(event: ClipboardEvent): void {
    const {clipboardData} = event;
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
            this.defaultValues.noData,
          sellerName:
            record['Nazwa sprzedawcy/pożyczkodawcy/emitenta'] ||
            this.defaultValues.noData,
          buyerName:
            record['Nazwa odbiorcy/pożyczkobiorcy'] ||
            this.defaultValues.noData,
          transactionType:
            record['Rodzaj transakcji'] || this.defaultValues.noTransactionData,
          transactionSubject:
            record['Nazwa/przedmiot transakcji'] || this.defaultValues.noData,
          netValue:
            parseFloat(
              record[
                'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
                ]
            ) || this.defaultValues.noDataNumeric,
          currency: record['Waluta'] || this.defaultValues.noData,
          loanDate:
            record['Data udzielenia pożyczki/gwarancji'] ||
            this.defaultValues.noData,
          interestRate:
            Number(record['Oprocentowanie (w przypadku transakcji finansowych)']) ||
            this.defaultValues.noDataNumeric,
          repaymentDate:
            record['Data spłaty (w przypadku transakcji finansowych)'] ||
            this.defaultValues.noData,
          significanceLimit: 0,
          homogeneousTransactionValue:
          // Defaultowo to samo co w kolumnie "netValue"
            parseFloat(
              record[
                'Wartość netto świadczeń zrealizowanych w danym roku/Wartość najwyższego udostępnionego w roku podatkowym kapitału'
                ]
            ) || this.defaultValues.noDataNumeric,
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
        interestRate: columns[9] || 0,
        repaymentDate: columns[10] || '',
        significanceLimit: parseValue(columns[11]),
        homogeneousTransactionValue: parseValue(columns[12]),
        taxExemption: columns[13] || '',
        documentationRequirement: columns[14] || '',
        benchmarkRequirement: columns[15] || '',
        tpr: columns[16] || '',
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
        transactionId: columns[0] || '',
        year: columns[1] || '',
        sellerName: columns[2] || '',
        buyerName: columns[3] || '',
        transactionType: columns[4] || '',
        transactionSubject: columns[5] || '',
        netValue: Number(columns[6]),
        currency: columns[7] || '',
        loanDate: columns[8] || '',
        interestRate: columns[9] || 0,
        repaymentDate: columns[10] || '',
        significanceLimit: Number(columns[11]) || 0,
        homogeneousTransactionValue: Number(columns[12]) || 0,
        taxExemption: columns[13] || '',
        documentationRequirement: columns[14] || '',
        benchmarkRequirement: columns[15] || '',
        tpr: columns[16] || '',
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


  analyzeData(): void {
    if (this.transactions.length > 0) {
      // console.log('Analyzing data...');

      // Extract unique company names (if provided)
      const uniqueCompanyNames = new Set<string>();
      this.transactions.forEach((transaction) => {
        if (transaction.sellerName !== this.defaultValues.noData) {
          uniqueCompanyNames.add(transaction.sellerName);
        }
        if (transaction.buyerName !== this.defaultValues.noData) {
          uniqueCompanyNames.add(transaction.buyerName);
        }
      });

      // Create Company objects for each unique company name
      let companyId = 1;
      let companies: Company[] = Array.from(uniqueCompanyNames).map(
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
          consolidationReport____________K: 'NIE',
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
          displayColor: 'none',
          displayBold: false,
        })
      );

      companies = companies.map((company) =>
        this.companyDataStorageService.applyCellFormulas(company)
      );
      this.companyDataStorageService.setCompanies(companies);
      this.transactionDataStorageService.setTransactions(this.transactions);
      this.transactionDataStorageService.setAllTransactionLimits();
      this.router.navigate(['/material-tabs-test']);
    } else {
      // console.log('No data to analyze');
    }
  }


  get hasData(): boolean {
    return this.transactions.length > 0;
  }

  constructor() {
  }
}
