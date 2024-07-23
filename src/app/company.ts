/**
 * Represents the structure of a company's information.
 *
 * @interface Company
 * @property {number} companyId - Unique identifier for the company.
 * @property {string} A_entityName - The official name of the entity.
 * @property {'TAK' | 'NIE'} B_dctExemptionAllSources - Indicates if the company is exempt from DCT (domestic country tax) for all sources.
 * @property {'TAK' | 'NIE'} C_dctExemptionCapitalSource - Indicates if the company is exempt from DCT for capital sources.
 * @property {'TAK' | 'NIE'} D_dctExemptionOtherSources - Indicates if the company is exempt from DCT for other sources.
 * @property {'TAK' | 'NIE'} E_benchmarkExemptionSmallMicro - Indicates if the company is exempt from benchmark obligations for being small/micro.
 * @property {'TAK' | 'NIE'} F_masterFileObligation - Indicates if the company has an obligation to maintain a master file.
 * @property {'TAK' | 'NIE'} G_covidExemption - Indicates if the company is exempt from certain obligations due to COVID-19.
 * @property {number} H_taxProfitLossCapitalSources2023 - Tax profit or loss from capital sources in 2023.
 * @property {number} I_taxProfitLossOtherSources2023 - Tax profit or loss from other sources in 2023.
 * @property {'TAK' | 'NIE'} J_pitCITExemption2023 - Indicates if the company had exemptions from PIT/CIT in 2023.
 * @property {'TAK' | 'NIE'} K_consolidationReport - Indicates if the company's report is subject to consolidation.
 * @property {number} L_consolidatedRevenue2022 - Consolidated revenue of the group in 2022.
 * @property {number} M_averageEmployment2022 - Average employment in 2022.
 * @property {number} N_netAnnualTurnover2022 - Net annual turnover from sales, products, services, and financial operations in 2022.
 * @property {number} O_totalAssets2022 - Total assets in 2022.
 * @property {'TAK' | 'NIE'} P_employmentBelow10 - Indicates if employment was below 10 people.
 * @property {'TAK' | 'NIE'} Q_turnoverBelow2M_EUR - Indicates if turnover was below 2 million EUR.
 * @property {'TAK' | 'NIE'} R_totalAssetsBelow2M_EUR - Indicates if total balance was below 2 million EUR.

 **/

export interface Company {
  companyId: number;
  A_entityName: string; // Nazwa podmiotu
  B_dctExemptionAllSources: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła
  C_dctExemptionCapitalSource: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe
  D_dctExemptionOtherSources: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła
  E_benchmarkExemptionSmallMicro: 'TAK' | 'NIE'; // Zwolnienie z obowiązku benchmarku - mały/mikro
  F_masterFileObligation: 'TAK' | 'NIE'; // Obowiązek master file
  G_covidExemption: 'TAK' | 'NIE'; // Zwolnienie tzw. covidove
  H_taxProfitLossCapitalSources2023: number; // Zysk / Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH
  I_taxProfitLossOtherSources2023: number; // Zysk / Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ
  J_pitCITExemption2023: 'TAK' | 'NIE'; // Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji
  K_consolidationReport: 'TAK' | 'NIE'; // Czy sprawozdanie podlega konsolidacji
  L_consolidatedRevenue2022: number; // Skonsolidowane przychody grupy w 2022
  M_averageEmployment2022: number; // Średnioroczne zatrudnienie w 2022
  N_netAnnualTurnover2022: number; // Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022
  O_totalAssets2022: number; // suma aktywów 2022
  P_employmentBelow10: 'TAK' | 'NIE'; // Zatrudnienie poniżej 10 osób
  Q_turnoverBelow2M_EUR: 'TAK' | 'NIE'; // Obroty poniżej 2 mln EUR
  R_totalAssetsBelow2M_EUR: 'TAK' | 'NIE'; // Suma bilansowa poniżej 2 mln EUR
  S_qualification: 'TAK' | 'NIE'; // Kwalifikacja
  T_employmentBelow50: 'TAK' | 'NIE'; // Zatrudnienie poniżej 50 osób
  U_turnoverBelow10M_EUR: 'TAK' | 'NIE'; // Obroty poniżej 10 mln EUR
  V_totalAssetsBelow10M_EUR: 'TAK' | 'NIE'; // Suma bilansowa poniżej 10 mlnEUR
  W_qualification: 'TAK' | 'NIE'; // Kwalifikacja
  X_totalRevenue2022: number; // Przychody razem 2022
  Y_totalRevenue2023: number; // Przychody razem 2023
  displayColor: string;
  displayBold: boolean;

  [property: string]: any;
}
