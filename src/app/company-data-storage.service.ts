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
      .filter((txn) => txn.sellerName === styledCompany.A_entityName)
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
      .filter((txn) => txn.buyerName === styledCompany.A_entityName)
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
          txn.buyerName === styledCompany.A_entityName ||
          txn.sellerName === styledCompany.A_entityName
      )
      .forEach((txn) => {
        const updatedTransaction = { ...txn };

        // Update benchmarkRequirement column value
        updatedTransaction.benchmarkRequirement =
          styledCompany.E_benchmarkExemptionSmallMicro;

        // Update taxExemption (Zwolnienie art. 11n CIT) column value
        txn.transactionType === 'Transakcja finansowa'
          ? (updatedTransaction.taxExemption =
              styledCompany.C_dctExemptionCapitalSource)
          : (updatedTransaction.taxExemption =
              styledCompany.D_dctExemptionOtherSources);

        // Update documentationRequirement & tpr columns values
        if (
          styledCompany.C_dctExemptionCapitalSource === 'TAK' &&
          styledCompany.D_dctExemptionOtherSources === 'TAK'
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
      resultCompany.C_dctExemptionCapitalSource === 'TAK' &&
      resultCompany.D_dctExemptionOtherSources === 'TAK'
    ) {
      resultCompany.displayColor = '#4CAF50';
      this.passChangesToTransactions(resultCompany);
    } else if (
      resultCompany.C_dctExemptionCapitalSource === 'TAK' &&
      resultCompany.D_dctExemptionOtherSources === 'NIE'
    ) {
      resultCompany.displayColor = '#4682B4';
      this.passChangesToTransactions(resultCompany);
    } else if (
      resultCompany.C_dctExemptionCapitalSource === 'NIE' &&
      resultCompany.D_dctExemptionOtherSources === 'TAK'
    ) {
      resultCompany.displayColor = '#FF6d01';
      this.passChangesToTransactions(resultCompany);
    } else {
      resultCompany.displayColor = 'none';
      this.passChangesToTransactions(resultCompany);
    }

    // Set boldness
    if (resultCompany.E_benchmarkExemptionSmallMicro === 'TAK') {
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

    if (resultCompany.K_consolidationReport === 'TAK') {
      resultCompany.C_dctExemptionCapitalSource = 'TAK';
    } else {
      resultCompany.C_dctExemptionCapitalSource = 'NIE';
    }

    if (resultCompany.I_taxProfitLossOtherSources2023 > 0) {
      resultCompany.D_dctExemptionOtherSources = 'TAK';
    } else {
      resultCompany.D_dctExemptionOtherSources = 'NIE';
    }

    if (resultCompany.H_taxProfitLossCapitalSources2023 > 0) {
      resultCompany.E_benchmarkExemptionSmallMicro = 'TAK';
    } else {
      resultCompany.E_benchmarkExemptionSmallMicro = 'NIE';
    }

    return resultCompany;
  }

  applyCellFormulas(inputCompany: Company): Company {
    const resultCompany = { ...inputCompany };

    // Zakładamy, że default values w kolumnach numerycznych to 0, a w kolumanach text/boolean - "NIE".
    // Z tego względu przeczenie isEmpty zawsze będzie prawdziwe
    const PUSTA = 'NIE';
    const KURS_EURO = 4.25;

    // Setting appropiate property values of the Company object

    //  Setting C_dctExemptionCapitalSource
    cell_G(resultCompany);
    cell_C(resultCompany);
    //  Setting D_dctExemptionOtherSources
    cell_D(resultCompany);
    //  Setting E_benchmarkExemptionSmallMicro
    cell_T(resultCompany);
    cell_U(resultCompany);
    cell_V(resultCompany);
    cell_W(resultCompany);
    cell_P(resultCompany);
    cell_Q(resultCompany);
    cell_R(resultCompany);
    cell_S(resultCompany);
    cell_E(resultCompany);

    // Cell functions
    function cell_C(inputCompany: Company): void {
      if (inputCompany.J_pitCITExemption2023 === 'TAK') {
        inputCompany.C_dctExemptionCapitalSource = 'NIE';
      } else if (
        (!isEmpty(inputCompany.H_taxProfitLossCapitalSources2023) &&
          inputCompany.J_pitCITExemption2023 === 'NIE' &&
          inputCompany.H_taxProfitLossCapitalSources2023 > 0) ||
        (inputCompany.J_pitCITExemption2023 === 'NIE' &&
          inputCompany.G_covidExemption === 'TAK')
      ) {
        inputCompany.C_dctExemptionCapitalSource = 'TAK';
      } else if (
        !isEmpty(inputCompany.H_taxProfitLossCapitalSources2023) &&
        inputCompany.H_taxProfitLossCapitalSources2023 < 0
      ) {
        inputCompany.C_dctExemptionCapitalSource = 'NIE';
      } else {
        inputCompany.C_dctExemptionCapitalSource = PUSTA;
      }
    }

    function cell_D(inputCompany: Company): void {
      if (inputCompany.J_pitCITExemption2023 === 'TAK') {
        inputCompany.D_dctExemptionOtherSources = 'NIE';
      } else if (
        (!isEmpty(inputCompany.I_taxProfitLossOtherSources2023) &&
          inputCompany.J_pitCITExemption2023 === 'NIE' &&
          inputCompany.I_taxProfitLossOtherSources2023 > 0) ||
        (inputCompany.J_pitCITExemption2023 === 'NIE' &&
          inputCompany.G_covidExemption === 'TAK')
      ) {
        inputCompany.D_dctExemptionOtherSources = 'TAK';
      } else if (
        !isEmpty(inputCompany.I_taxProfitLossOtherSources2023) &&
        inputCompany.I_taxProfitLossOtherSources2023 < 0
      ) {
        inputCompany.D_dctExemptionOtherSources = 'NIE';
      } else {
        inputCompany.D_dctExemptionOtherSources = PUSTA;
      }
    }

    function cell_E(inputCompany: Company): void {
      if (
        inputCompany.S_qualification === 'TAK' ||
        inputCompany.W_qualification === 'TAK'
      ) {
        inputCompany.E_benchmarkExemptionSmallMicro = 'TAK';
      } else if (
        inputCompany.S_qualification === 'NIE' &&
        inputCompany.W_qualification === 'NIE'
      ) {
        inputCompany.E_benchmarkExemptionSmallMicro = 'NIE';
      } else {
        inputCompany.E_benchmarkExemptionSmallMicro = PUSTA;
      }
    }

    function cell_F(inputCompany: Company): void {
      if (
        inputCompany.K_consolidationReport === 'TAK' &&
        inputCompany.L_consolidatedRevenue2022 > 200000000
      ) {
        inputCompany.F_masterFileObligation = 'TAK';
      } else if (
        inputCompany.K_consolidationReport === 'NIE' ||
        inputCompany.L_consolidatedRevenue2022 <= 200000000
      ) {
        inputCompany.F_masterFileObligation = 'NIE';
      } else {
        inputCompany.F_masterFileObligation = PUSTA;
      }
    }

    function cell_G(inputCompany: Company): void {
      if (
        !isEmpty(inputCompany.X_totalRevenue2022) &&
        !isEmpty(inputCompany.Y_totalRevenue2023) &&
        inputCompany.X_totalRevenue2022 - inputCompany.Y_totalRevenue2023 >=
          inputCompany.X_totalRevenue2022 * 0.5
      ) {
        inputCompany.G_covidExemption = 'TAK';
      } else if (
        !isEmpty(inputCompany.X_totalRevenue2022) &&
        !isEmpty(inputCompany.Y_totalRevenue2023)
      ) {
        inputCompany.G_covidExemption = 'NIE';
      } else {
        inputCompany.G_covidExemption = PUSTA;
      }
    }

    function cell_P(inputCompany: Company): void {
      if (!isEmpty(inputCompany.M_averageEmployment2022)) {
        if (inputCompany.M_averageEmployment2022 < 10) {
          inputCompany.P_employmentBelow10 = 'TAK';
        } else {
          inputCompany.P_employmentBelow10 = 'NIE';
        }
      } else {
        inputCompany.P_employmentBelow10 = PUSTA;
      }
    }

    function cell_Q(inputCompany: Company): void {
      if (!isEmpty(inputCompany.N_netAnnualTurnover2022)) {
        if (inputCompany.N_netAnnualTurnover2022 / KURS_EURO < 2000000) {
          inputCompany.Q_turnoverBelow2M_EUR = 'TAK';
        } else {
          inputCompany.Q_turnoverBelow2M_EUR = 'NIE';
        }
      } else {
        inputCompany.Q_turnoverBelow2M_EUR = PUSTA;
      }
    }

    function cell_R(inputCompany: Company): void {
      if (!isEmpty(inputCompany.O_totalAssets2022)) {
        if (inputCompany.O_totalAssets2022 / KURS_EURO < 2000000) {
          inputCompany.R_totalAssetsBelow2M_EUR = 'TAK';
        } else {
          inputCompany.R_totalAssetsBelow2M_EUR = 'NIE';
        }
      } else {
        inputCompany.R_totalAssetsBelow2M_EUR = PUSTA;
      }
    }

    function cell_S(inputCompany: Company): void {
      if (
        inputCompany.P_employmentBelow10 === 'TAK' &&
        (inputCompany.Q_turnoverBelow2M_EUR === 'TAK' ||
          inputCompany.R_totalAssetsBelow2M_EUR === 'TAK')
      ) {
        inputCompany.S_qualification = 'TAK';
      } else if (
        inputCompany.P_employmentBelow10 === 'NIE' ||
        (inputCompany.Q_turnoverBelow2M_EUR === 'NIE' &&
          inputCompany.R_totalAssetsBelow2M_EUR === 'NIE')
      ) {
        inputCompany.S_qualification = 'NIE';
      } else {
        inputCompany.S_qualification = PUSTA;
      }
    }

    function cell_T(inputCompany: Company): void {
      if (!isEmpty(inputCompany.M_averageEmployment2022)) {
        if (inputCompany.M_averageEmployment2022 < 50) {
          inputCompany.T_employmentBelow50 = 'TAK';
        } else {
          inputCompany.T_employmentBelow50 = 'NIE';
        }
      } else {
        inputCompany.T_employmentBelow50 = PUSTA;
      }
    }

    function cell_U(inputCompany: Company): void {
      if (!isEmpty(inputCompany.N_netAnnualTurnover2022)) {
        if (inputCompany.N_netAnnualTurnover2022 / KURS_EURO < 10000000) {
          inputCompany.U_turnoverBelow10M_EUR = 'TAK';
        } else {
          inputCompany.U_turnoverBelow10M_EUR = 'NIE';
        }
      } else {
        inputCompany.U_turnoverBelow10M_EUR = PUSTA;
      }
    }

    function cell_V(inputCompany: Company): void {
      if (!isEmpty(inputCompany.O_totalAssets2022)) {
        if (inputCompany.O_totalAssets2022 / KURS_EURO < 10000000) {
          inputCompany.V_totalAssetsBelow10M_EUR = 'TAK';
        } else {
          inputCompany.V_totalAssetsBelow10M_EUR = 'NIE';
        }
      } else {
        inputCompany.V_totalAssetsBelow10M_EUR = PUSTA;
      }
    }

    function cell_W(inputCompany: Company): void {
      if (
        inputCompany.T_employmentBelow50 === 'TAK' &&
        (inputCompany.U_turnoverBelow10M_EUR === 'TAK' ||
          inputCompany.V_totalAssetsBelow10M_EUR === 'TAK')
      ) {
        inputCompany.W_qualification = 'TAK';
      } else if (
        inputCompany.T_employmentBelow50 === 'NIE' ||
        (inputCompany.U_turnoverBelow10M_EUR === 'NIE' &&
          inputCompany.V_totalAssetsBelow10M_EUR === 'NIE')
      ) {
        inputCompany.W_qualification = 'NIE';
      } else {
        inputCompany.W_qualification = PUSTA;
      }
    }

    function isEmpty(value: any): boolean {
      return value === null || value === undefined || value === '';
    }

    return resultCompany;
  }
}
