/**
 * Represents the structure of a company's information.
 *
 * @interface Company
 * @property {number} companyId - Unique identifier for the company.
 * @property {string} entityName____________________A - The official name of the entity.
 * @property {'TAK' | 'NIE'} dctExemptionAllSources________B - Indicates if the company is exempt from DCT (domestic country tax) for all sources.
 * @property {'TAK' | 'NIE'} dctExemptionCapitalSource_____C - Indicates if the company is exempt from DCT for capital sources.
 * @property {'TAK' | 'NIE'} dctExemptionOtherSources______D - Indicates if the company is exempt from DCT for other sources.
 * @property {'TAK' | 'NIE'} benchmarkExemptionSmallMicro__E - Indicates if the company is exempt from benchmark obligations for being small/micro.
 * @property {'TAK' | 'NIE'} masterFileObligation___________F - Indicates if the company has an obligation to maintain a master file.
 * @property {'TAK' | 'NIE'} covidExemption_________________G - Indicates if the company is exempt from certain obligations due to COVID-19.
 * @property {number} taxProfitLossCapitalSources2023_H - Tax profit or loss from capital sources in 2023.
 * @property {number} taxProfitLossOtherSources2023__I - Tax profit or loss from other sources in 2023.
 * @property {'TAK' | 'NIE'} pitCITExemption2023____________J - Indicates if the company had exemptions from PIT/CIT in 2023.
 * @property {'TAK' | 'NIE'} consolidationReport____________K - Indicates if the company's report is subject to consolidation.
 * @property {number} consolidatedRevenue2022________L - Consolidated revenue of the group in 2022.
 * @property {number} averageEmployment2022__________M - Average employment in 2022.
 * @property {number} netAnnualTurnover2022__________N - Net annual turnover from sales, products, services, and financial operations in 2022.
 * @property {number} totalAssets2022________________O - Total assets in 2022.
 * @property {'TAK' | 'NIE'} employmentBelow10______________P - Indicates if employment was below 10 people.
 * @property {'TAK' | 'NIE'} turnoverBelow2M_EUR____________Q - Indicates if turnover was below 2 million EUR.
 * @property {'TAK' | 'NIE'} totalAssetsBelow2M_EUR_________R - Indicates if total balance was below 2 million EUR.

 **/

// Editable properties can be set to null
export interface Company {
  companyId: number;
  entityName____________________A: string; // Nazwa podmiotu
  dctExemptionAllSources________B: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła
  dctExemptionCapitalSource_____C: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe
  dctExemptionOtherSources______D: 'TAK' | 'NIE'; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła
  benchmarkExemptionSmallMicro__E: 'TAK' | 'NIE'; // Zwolnienie z obowiązku benchmarku - mały/mikro
  masterFileObligation___________F: 'TAK' | 'NIE' | null; // Obowiązek master file
  covidExemption_________________G: 'TAK' | 'NIE'; // Zwolnienie tzw. covidove
  taxProfitLossCapitalSources2023_H: number | null; // Zysk / Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH
  taxProfitLossOtherSources2023__I: number | null; // Zysk / Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ
  pitCITExemption2023____________J: 'TAK' | 'NIE' | null; // Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji
  consolidationReport____________K: 'TAK' | 'NIE' | null; // Czy sprawozdanie podlega konsolidacji
  consolidatedRevenue2022________L: number | null; // Skonsolidowane przychody grupy w 2022
  averageEmployment2022__________M: number | null; // Średnioroczne zatrudnienie w 2022
  netAnnualTurnover2022__________N: number | null; // Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022
  totalAssets2022________________O: number | null; // suma aktywów 2022
  employmentBelow10______________P: 'TAK' | 'NIE'; // Zatrudnienie poniżej 10 osób
  turnoverBelow2M_EUR____________Q: 'TAK' | 'NIE'; // Obroty poniżej 2 mln EUR
  totalAssetsBelow2M_EUR_________R: 'TAK' | 'NIE'; // Suma bilansowa poniżej 2 mln EUR
  qualification__________________S: 'TAK' | 'NIE'; // Kwalifikacja
  employmentBelow50______________T: 'TAK' | 'NIE'; // Zatrudnienie poniżej 50 osób
  turnoverBelow10M_EUR___________U: 'TAK' | 'NIE'; // Obroty poniżej 10 mln EUR
  totalAssetsBelow10M_EUR________V: 'TAK' | 'NIE'; // Suma bilansowa poniżej 10 mlnEUR
  qualification__________________W: 'TAK' | 'NIE'; // Kwalifikacja
  totalRevenue2022_______________X: number | null; // Przychody razem 2022
  totalRevenue2023_______________Y: number | null; // Przychody razem 2023
  displayColor: string;
  displayBold: boolean;

  [property: string]: any;
}
