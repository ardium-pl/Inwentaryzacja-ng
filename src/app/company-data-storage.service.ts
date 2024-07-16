import {Injectable, signal, inject, computed} from '@angular/core';
import {Company} from './company';
import {TransactionDataStorageService} from './transaction-data-storage.service';

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

    // Update benchmarkRequirement
    // TUTAJ BEDZIEMY UDPATE'OWAC POZOSTALE BOOLEAN KOLUMNY W TABELACH TRANSAKCJI
    this.transactions()
      .filter(
        (txn) =>
          txn.buyerName === styledCompany.entityName____________________A ||
          txn.sellerName === styledCompany.entityName____________________A
      )
      .forEach((txn) => {
        const updatedTransaction = { ...txn };

        updatedTransaction.benchmarkRequirement =
          styledCompany.benchmarkExemptionSmallMicro__E;

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
      resultCompany.dctExemptionCapitalSource_____C ===
        resultCompany.dctExemptionOtherSources______D
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
