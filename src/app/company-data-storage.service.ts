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
    let analizedCompany = this.applyCellFormulas2(updatedCompany);
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

    // Apply formulas in the correct order
    resultCompany.taxProfitLossCapitalSources2023_H =
      this.formulaH(resultCompany);
    resultCompany.taxProfitLossOtherSources2023__I =
      this.formulaI(resultCompany);
    resultCompany.dctExemptionCapitalSource_____C =
      this.formulaC(resultCompany);
    resultCompany.dctExemptionOtherSources______D =
      this.formulaD(resultCompany);
    resultCompany.dctExemptionAllSources________B =
      this.formulaB(resultCompany);
    resultCompany.benchmarkExemptionSmallMicro__E =
      this.formulaE(resultCompany);
    resultCompany.masterFileObligation___________F =
      this.formulaF(resultCompany);
    resultCompany.covidExemption_________________G =
      this.formulaG(resultCompany);
    resultCompany.employmentBelow10______________P =
      this.formulaP(resultCompany);
    resultCompany.turnoverBelow2M_EUR____________Q =
      this.formulaQ(resultCompany);
    resultCompany.totalAssetsBelow2M_EUR_________R =
      this.formulaR(resultCompany);
    resultCompany.qualification__________________S =
      this.formulaS(resultCompany);
    resultCompany.employmentBelow50______________T =
      this.formulaT(resultCompany);
    resultCompany.turnoverBelow10M_EUR___________U =
      this.formulaU(resultCompany);
    resultCompany.totalAssetsBelow10M_EUR________V =
      this.formulaV(resultCompany);
    resultCompany.qualification__________________W =
      this.formulaW(resultCompany);

    return resultCompany;
  }

  formulaB(company: Company): 'TAK' | 'NIE' {
    if (
      company.dctExemptionCapitalSource_____C === 'TAK' &&
      company.dctExemptionOtherSources______D === 'TAK'
    ) {
      return 'TAK';
    } else if (
      company.dctExemptionCapitalSource_____C === 'NIE' ||
      company.dctExemptionOtherSources______D === 'NIE'
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaC(company: Company): 'TAK' | 'NIE' {
    if (company.pitCITExemption2023____________J === 'TAK') {
      return 'NIE';
    } else if (
      (!this.isEmpty(company.taxProfitLossCapitalSources2023_H) &&
        company.pitCITExemption2023____________J === 'NIE' &&
        company.taxProfitLossCapitalSources2023_H > 0) ||
      (company.pitCITExemption2023____________J === 'NIE' &&
        company.covidExemption_________________G === 'TAK')
    ) {
      return 'TAK';
    } else if (
      !this.isEmpty(company.taxProfitLossCapitalSources2023_H) &&
      company.taxProfitLossCapitalSources2023_H < 0
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaD(company: Company): 'TAK' | 'NIE' {
    if (company.pitCITExemption2023____________J === 'TAK') {
      return 'NIE';
    } else if (
      (!this.isEmpty(company.taxProfitLossOtherSources2023__I) &&
        company.pitCITExemption2023____________J === 'NIE' &&
        company.taxProfitLossOtherSources2023__I > 0) ||
      (company.pitCITExemption2023____________J === 'NIE' &&
        company.covidExemption_________________G === 'TAK')
    ) {
      return 'TAK';
    } else if (
      !this.isEmpty(company.taxProfitLossOtherSources2023__I) &&
      company.taxProfitLossOtherSources2023__I < 0
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaE(company: Company): 'TAK' | 'NIE' {
    if (
      company.qualification__________________S === 'TAK' ||
      company.qualification__________________W === 'TAK'
    ) {
      return 'TAK';
    } else if (
      company.qualification__________________S === 'NIE' &&
      company.qualification__________________W === 'NIE'
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaF(company: Company): 'TAK' | 'NIE' {
    if (
      company.consolidationReport____________K === 'TAK' &&
      company.consolidatedRevenue2022________L > 200000000
    ) {
      return 'TAK';
    } else if (
      company.consolidationReport____________K === 'NIE' ||
      company.consolidatedRevenue2022________L <= 200000000
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaG(company: Company): 'TAK' | 'NIE' {
    if (
      !this.isEmpty(company.totalRevenue2022_______________X) &&
      !this.isEmpty(company.totalRevenue2023_______________Y) &&
      company.totalRevenue2022_______________X -
        company.totalRevenue2023_______________Y >=
        company.totalRevenue2022_______________X * 0.5
    ) {
      return 'TAK';
    } else if (
      !this.isEmpty(company.totalRevenue2022_______________X) &&
      !this.isEmpty(company.totalRevenue2023_______________Y)
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaH(company: Company): number {
    return company.taxProfitLossCapitalSources2023_H || 0;
  }

  formulaI(company: Company): number {
    return company.taxProfitLossOtherSources2023__I || 0;
  }

  formulaP(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.averageEmployment2022__________M)) {
      return company.averageEmployment2022__________M < 10 ? 'TAK' : 'NIE';
    }
    return 'NIE';
  }

  formulaQ(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.netAnnualTurnover2022__________N)) {
      return company.netAnnualTurnover2022__________N / this.kursEURO < 2000000
        ? 'TAK'
        : 'NIE';
    }
    return 'NIE';
  }

  formulaR(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.totalAssets2022________________O)) {
      return company.totalAssets2022________________O / this.kursEURO < 2000000
        ? 'TAK'
        : 'NIE';
    }
    return 'NIE';
  }

  formulaS(company: Company): 'TAK' | 'NIE' {
    if (
      company.employmentBelow10______________P === 'TAK' &&
      (company.turnoverBelow2M_EUR____________Q === 'TAK' ||
        company.totalAssetsBelow2M_EUR_________R === 'TAK')
    ) {
      return 'TAK';
    } else if (
      company.employmentBelow10______________P === 'NIE' &&
      company.turnoverBelow2M_EUR____________Q === 'NIE' &&
      company.totalAssetsBelow2M_EUR_________R === 'NIE'
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  formulaT(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.averageEmployment2022__________M)) {
      return company.averageEmployment2022__________M < 50 ? 'TAK' : 'NIE';
    }
    return 'NIE';
  }

  formulaU(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.netAnnualTurnover2022__________N)) {
      return company.netAnnualTurnover2022__________N / this.kursEURO < 10000000
        ? 'TAK'
        : 'NIE';
    }
    return 'NIE';
  }

  formulaV(company: Company): 'TAK' | 'NIE' {
    if (!this.isEmpty(company.totalAssets2022________________O)) {
      return company.totalAssets2022________________O / this.kursEURO < 10000000
        ? 'TAK'
        : 'NIE';
    }
    return 'NIE';
  }

  formulaW(company: Company): 'TAK' | 'NIE' {
    if (
      company.employmentBelow50______________T === 'TAK' &&
      (company.turnoverBelow10M_EUR___________U === 'TAK' ||
        company.totalAssetsBelow10M_EUR________V === 'TAK')
    ) {
      return 'TAK';
    } else if (
      company.employmentBelow50______________T === 'NIE' &&
      company.turnoverBelow10M_EUR___________U === 'NIE' &&
      company.totalAssetsBelow10M_EUR________V === 'NIE'
    ) {
      return 'NIE';
    }
    return 'NIE';
  }

  isEmpty(value: any): boolean {
    return value === null || value === undefined || value === '';
  }
}

// ############################################################################################
// Zakładamy, że defaul values w kolumnach numerycznych to 0, a w kolumanach text/boolean - "NIE".
// Z tego względu przeczenie isEmpty zawsze będzie prawdziwe

const PUSTA = 'NIE';
const KURS_EURO = 4.25;

function cell_C (inputCompany: Company): void {
  if (inputCompany.pitCITExemption2023____________J === 'TAK') {
    inputCompany.dctExemptionCapitalSource_____C = 'NIE';
  } else if (
    !isEmpty(inputCompany.taxProfitLossCapitalSources2023_H) &&
    (inputCompany.pitCITExemption2023____________J === 'NIE' &&
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
    (
      !isEmpty(inputCompany.taxProfitLossOtherSources2023__I) &&
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
    (inputCompany.totalRevenue2022_______________X -
      inputCompany.totalRevenue2023_______________Y) >=
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
    if (inputCompany.netAnnualTurnover2022__________N / KURS_EURO < 2000000) {
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
    if (inputCompany.totalAssets2022________________O / KURS_EURO < 2000000) {
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
    if (inputCompany.netAnnualTurnover2022__________N / KURS_EURO < 10000000) {
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
    if (inputCompany.totalAssets2022________________O / KURS_EURO < 10000000) {
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


