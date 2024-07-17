import { Injectable, signal, inject, computed } from '@angular/core';
import { Company } from './company';
import { TransactionDataStorageService } from './transaction-data-storage.service';
import { style } from '@angular/animations';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataStorageService {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly transactions = computed(() =>
    this.transactionDataStorageService.transactions()
  );

  readonly companies = signal<Company[]>([]);

  // Kurs bedzie wykorzystany jak zrobimy prawdilowa funkcje do formul
  kursEURO = 4.25;

  setCompanies(companies: Company[]) {
    this.companies.set(companies);
  }

  updateCompanies(updatedCompany: Company) {
    // Update the conditions based on cell formulas
    let analizedCompany = this.applyCellFormulas(updatedCompany);
    // Update styling properties
    let styledCompany = this.applyFontStyling(analizedCompany);
    // Update the signal
    this.companies.update((companies) =>
      companies.map((company) =>
        company.companyId === styledCompany.companyId ? styledCompany : company
      )
    );
  }

  passChangesToTransactions(styledCompany: Company) {
    // Update sellerName column styling
    this.transactions()
      .filter(
        (txn) =>
          txn.sellerName === styledCompany.entityName____________________A
      )
      .forEach((txn) => {
        const updatedTransaction = { ...txn };

        updatedTransaction.displayColor_seller = styledCompany.displayColor;
        updatedTransaction.displayBold_seller = styledCompany.displayBold;

        this.transactionDataStorageService.updateTransactions(
          updatedTransaction
        );
      });

    // Update buyerName column styling
    this.transactions()
      .filter(
        (txn) => txn.buyerName === styledCompany.entityName____________________A
      )
      .forEach((txn) => {
        const updatedTransaction = { ...txn };

        updatedTransaction.displayColor_buyer = styledCompany.displayColor;
        updatedTransaction.displayBold_buyer = styledCompany.displayBold;

        this.transactionDataStorageService.updateTransactions(
          updatedTransaction
        );
      });

    // Update values of boolean columns in transaction tables
    this.transactions()
      .filter(
        (txn) =>
          txn.buyerName === styledCompany.entityName____________________A ||
          txn.sellerName === styledCompany.entityName____________________A
      )
      .forEach((txn) => {
        const updatedTransaction = { ...txn };

        // Update benchmarkRequirement column value
        updatedTransaction.benchmarkRequirement =
          styledCompany.benchmarkExemptionSmallMicro__E;

        // Update taxExemption (Zwolnienie art. 11n CIT) column value
        txn.transactionType === 'Transakcja finansowa'
          ? (updatedTransaction.taxExemption =
              styledCompany.dctExemptionCapitalSource_____C)
          : (updatedTransaction.taxExemption =
              styledCompany.dctExemptionOtherSources______D);

        // Update documentationRequirement & tpr columns values
        if (
          styledCompany.dctExemptionCapitalSource_____C === 'TAK' &&
          styledCompany.dctExemptionOtherSources______D === 'TAK'
        ) {
          updatedTransaction.documentationRequirement = 'TAK';
          updatedTransaction.tpr = 'TAK';
        } else {
          updatedTransaction.documentationRequirement = 'NIE';
          updatedTransaction.tpr = 'NIE';
        }

        this.transactionDataStorageService.updateTransactions(
          updatedTransaction
        );
      });
  }

  applyFontStyling(analizedCompany: Company) {
    const resultCompany = { ...analizedCompany };

    // Set color
    if (
      resultCompany.dctExemptionCapitalSource_____C === 'TAK' &&
      resultCompany.dctExemptionOtherSources______D === 'TAK'
    ) {
      resultCompany.displayColor = '#4CAF50';
      this.passChangesToTransactions(resultCompany);
    } else if (
      resultCompany.dctExemptionCapitalSource_____C === 'TAK' &&
      resultCompany.dctExemptionOtherSources______D === 'NIE'
    ) {
      resultCompany.displayColor = '#4682B4';
      this.passChangesToTransactions(resultCompany);
    } else if (
      resultCompany.dctExemptionCapitalSource_____C === 'NIE' &&
      resultCompany.dctExemptionOtherSources______D === 'TAK'
    ) {
      resultCompany.displayColor = '#FF6d01';
      this.passChangesToTransactions(resultCompany);
    } else {
      resultCompany.displayColor = 'none';
      this.passChangesToTransactions(resultCompany);
    }

    // Set boldness
    if (resultCompany.benchmarkExemptionSmallMicro__E === 'TAK') {
      resultCompany.displayBold = true;
      this.passChangesToTransactions(resultCompany);
    } else {
      resultCompany.displayBold = false;
      this.passChangesToTransactions(resultCompany);
    }

    return resultCompany;
  }

  // For testing purposes
  applyCellFormulas2(inputCompany: Company): Company {
    const resultCompany = { ...inputCompany };

    if (resultCompany.consolidationReport____________K === 'TAK') {
      resultCompany.dctExemptionCapitalSource_____C = 'TAK';
    } else {
      resultCompany.dctExemptionCapitalSource_____C = 'NIE';
    }

    if (resultCompany.taxProfitLossOtherSources2023__I > 0) {
      resultCompany.dctExemptionOtherSources______D = 'TAK';
    } else {
      resultCompany.dctExemptionOtherSources______D = 'NIE';
    }

    if (resultCompany.taxProfitLossCapitalSources2023_H > 0) {
      resultCompany.benchmarkExemptionSmallMicro__E = 'TAK';
    } else {
      resultCompany.benchmarkExemptionSmallMicro__E = 'NIE';
    }

    return resultCompany;
  }

  applyCellFormulas(inputCompany: Company): Company {
    const resultCompany = { ...inputCompany };
    const PUSTA = 'NIE';
    const KURS_EURO = 4.25;

    // Setting appropiate property values of the Company object

    //  Setting dctExemptionCapitalSource_____C
    cell_G(resultCompany);
    cell_C(resultCompany);
    //  Setting dctExemptionOtherSources______D
    cell_D(resultCompany);
    //  Setting benchmarkExemptionSmallMicro__E
    cell_T(resultCompany);
    cell_U(resultCompany);
    cell_V(resultCompany);
    cell_P(resultCompany);
    cell_Q(resultCompany);
    cell_R(resultCompany);
    cell_E(resultCompany);

    // Cell functions
    function cell_C(inputCompany: Company): void {
      if (inputCompany.pitCITExemption2023____________J === 'TAK') {
        inputCompany.dctExemptionCapitalSource_____C = 'NIE';
      } else if (
        (!isEmpty(inputCompany.taxProfitLossCapitalSources2023_H) &&
          inputCompany.pitCITExemption2023____________J === 'NIE' &&
          inputCompany.taxProfitLossCapitalSources2023_H > 0) ||
        (inputCompany.pitCITExemption2023____________J === 'NIE' &&
          inputCompany.covidExemption_________________G === 'TAK')
      ) {
        inputCompany.dctExemptionCapitalSource_____C = 'TAK';
      } else if (
        !isEmpty(inputCompany.taxProfitLossCapitalSources2023_H) &&
        inputCompany.taxProfitLossCapitalSources2023_H < 0
      ) {
        inputCompany.dctExemptionCapitalSource_____C = 'NIE';
      } else {
        inputCompany.dctExemptionCapitalSource_____C = PUSTA;
      }
    }

    function cell_D(inputCompany: Company): void {
      if (inputCompany.pitCITExemption2023____________J === 'TAK') {
        inputCompany.dctExemptionOtherSources______D = 'NIE';
      } else if (
        (!isEmpty(inputCompany.taxProfitLossOtherSources2023__I) &&
          inputCompany.pitCITExemption2023____________J === 'NIE' &&
          inputCompany.taxProfitLossOtherSources2023__I > 0) ||
        (inputCompany.pitCITExemption2023____________J === 'NIE' &&
          inputCompany.covidExemption_________________G === 'TAK')
      ) {
        inputCompany.dctExemptionOtherSources______D = 'TAK';
      } else if (
        !isEmpty(inputCompany.taxProfitLossOtherSources2023__I) &&
        inputCompany.taxProfitLossOtherSources2023__I < 0
      ) {
        inputCompany.dctExemptionOtherSources______D = 'NIE';
      } else {
        inputCompany.dctExemptionOtherSources______D = PUSTA;
      }
    }

    function cell_E(inputCompany: Company): void {
      if (
        inputCompany.qualification__________________S === 'TAK' ||
        inputCompany.qualification__________________W === 'TAK'
      ) {
        inputCompany.benchmarkExemptionSmallMicro__E = 'TAK';
      } else if (
        inputCompany.qualification__________________S === 'NIE' &&
        inputCompany.qualification__________________W === 'NIE'
      ) {
        inputCompany.benchmarkExemptionSmallMicro__E = 'NIE';
      } else {
        inputCompany.benchmarkExemptionSmallMicro__E = PUSTA;
      }
    }

    function cell_F(inputCompany: Company): void {
      if (
        inputCompany.consolidationReport____________K === 'TAK' &&
        inputCompany.consolidatedRevenue2022________L > 200000000
      ) {
        inputCompany.masterFileObligation___________F = 'TAK';
      } else if (
        inputCompany.consolidationReport____________K === 'NIE' ||
        inputCompany.consolidatedRevenue2022________L <= 200000000
      ) {
        inputCompany.masterFileObligation___________F = 'NIE';
      } else {
        inputCompany.masterFileObligation___________F = PUSTA;
      }
    }

    function cell_G(inputCompany: Company): void {
      if (
        !isEmpty(inputCompany.totalRevenue2022_______________X) &&
        !isEmpty(inputCompany.totalRevenue2023_______________Y) &&
        inputCompany.totalRevenue2022_______________X -
          inputCompany.totalRevenue2023_______________Y >=
          inputCompany.totalRevenue2022_______________X * 0.5
      ) {
        inputCompany.covidExemption_________________G = 'TAK';
      } else if (
        !isEmpty(inputCompany.totalRevenue2022_______________X) &&
        !isEmpty(inputCompany.totalRevenue2023_______________Y)
      ) {
        inputCompany.covidExemption_________________G = 'NIE';
      } else {
        inputCompany.covidExemption_________________G = PUSTA;
      }
    }

    function cell_P(inputCompany: Company): void {
      if (!isEmpty(inputCompany.averageEmployment2022__________M)) {
        if (inputCompany.averageEmployment2022__________M < 10) {
          inputCompany.employmentBelow10______________P = 'TAK';
        } else {
          inputCompany.employmentBelow10______________P = 'NIE';
        }
      } else {
        inputCompany.employmentBelow10______________P = PUSTA;
      }
    }

    function cell_Q(inputCompany: Company): void {
      if (!isEmpty(inputCompany.netAnnualTurnover2022__________N)) {
        if (
          inputCompany.netAnnualTurnover2022__________N / KURS_EURO <
          2000000
        ) {
          inputCompany.turnoverBelow2M_EUR____________Q = 'TAK';
        } else {
          inputCompany.turnoverBelow2M_EUR____________Q = 'NIE';
        }
      } else {
        inputCompany.turnoverBelow2M_EUR____________Q = PUSTA;
      }
    }

    function cell_R(inputCompany: Company): void {
      if (!isEmpty(inputCompany.totalAssets2022________________O)) {
        if (
          inputCompany.totalAssets2022________________O / KURS_EURO <
          2000000
        ) {
          inputCompany.totalAssetsBelow2M_EUR_________R = 'TAK';
        } else {
          inputCompany.totalAssetsBelow2M_EUR_________R = 'NIE';
        }
      } else {
        inputCompany.totalAssetsBelow2M_EUR_________R = PUSTA;
      }
    }

    function cell_S(inputCompany: Company): void {
      if (
        inputCompany.employmentBelow10______________P === 'TAK' &&
        (inputCompany.turnoverBelow2M_EUR____________Q === 'TAK' ||
          inputCompany.totalAssetsBelow2M_EUR_________R === 'TAK')
      ) {
        inputCompany.qualification__________________S = 'TAK';
      } else if (
        inputCompany.employmentBelow10______________P === 'NIE' ||
        (inputCompany.turnoverBelow2M_EUR____________Q === 'NIE' &&
          inputCompany.totalAssetsBelow2M_EUR_________R === 'NIE')
      ) {
        inputCompany.qualification__________________S = 'NIE';
      } else {
        inputCompany.qualification__________________S = PUSTA;
      }
    }

    function cell_T(inputCompany: Company): void {
      if (!isEmpty(inputCompany.averageEmployment2022__________M)) {
        if (inputCompany.averageEmployment2022__________M < 50) {
          inputCompany.employmentBelow50______________T = 'TAK';
        } else {
          inputCompany.employmentBelow50______________T = 'NIE';
        }
      } else {
        inputCompany.employmentBelow50______________T = PUSTA;
      }
    }

    function cell_U(inputCompany: Company): void {
      if (!isEmpty(inputCompany.netAnnualTurnover2022__________N)) {
        if (
          inputCompany.netAnnualTurnover2022__________N / KURS_EURO <
          10000000
        ) {
          inputCompany.turnoverBelow10M_EUR___________U = 'TAK';
        } else {
          inputCompany.turnoverBelow10M_EUR___________U = 'NIE';
        }
      } else {
        inputCompany.turnoverBelow10M_EUR___________U = PUSTA;
      }
    }

    function cell_V(inputCompany: Company): void {
      if (!isEmpty(inputCompany.totalAssets2022________________O)) {
        if (
          inputCompany.totalAssets2022________________O / KURS_EURO <
          10000000
        ) {
          inputCompany.totalAssetsBelow10M_EUR________V = 'TAK';
        } else {
          inputCompany.totalAssetsBelow10M_EUR________V = 'NIE';
        }
      } else {
        inputCompany.totalAssetsBelow10M_EUR________V = PUSTA;
      }
    }

    function cell_W(inputCompany: Company): void {
      if (
        inputCompany.employmentBelow50______________T === 'TAK' &&
        (inputCompany.turnoverBelow10M_EUR___________U === 'TAK' ||
          inputCompany.totalAssetsBelow10M_EUR________V === 'TAK')
      ) {
        inputCompany.qualification__________________W = 'TAK';
      } else if (
        inputCompany.employmentBelow50______________T === 'NIE' ||
        (inputCompany.turnoverBelow10M_EUR___________U === 'NIE' &&
          inputCompany.totalAssetsBelow10M_EUR________V === 'NIE')
      ) {
        inputCompany.qualification__________________W = 'NIE';
      } else {
        inputCompany.qualification__________________W = PUSTA;
      }
    }

    function isEmpty(value: any): boolean {
      return value === null || value === undefined || value === '';
    }

    return resultCompany;
  }
}

// Zakładamy, że defaul values w kolumnach numerycznych to 0, a w kolumanach text/boolean - "NIE".
// Z tego względu przeczenie isEmpty zawsze będzie prawdziwe
