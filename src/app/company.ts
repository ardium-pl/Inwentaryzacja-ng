export interface Company {
  entityName____________________A: string; // Nazwa podmiotu
  dctExemptionAllSources________B: boolean; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła
  dctExemptionCapitalSource_____C: boolean; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe
  dctExemptionOtherSources______D: boolean; // Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła
  benchmarkExemptionSmallMicro__E: boolean; // Zwolnienie z obowiązku benchmarku - mały/mikro
  masterFileObligation___________F: boolean; // Obowiązek master file
  covidExemption_________________G: boolean; // Zwolnienie tzw. covidove
  taxProfitLossCapitalSources2023_H: number; // Zysk/Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH
  taxProfitLossOtherSources2023__I: number; // Zysk/Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ
  pitCITExemption2023____________J: boolean; // Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji
  consolidationReport____________K: boolean; // Czy sprawozdanie podlega konsolidacji
  consolidatedRevenue2022________L: number; // Skonsolidowane przychody grupy w 2022
  averageEmployment2022__________M: number; // Średnioroczne zatrudnienie w 2022
  netAnnualTurnover2022__________N: number; // Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022
  totalAssets2022________________O: number; // suma aktywów 2022
  employmentBelow10______________P: boolean; // Zatrudnienie poniżej 10 osób
  turnoverBelow2M_EUR____________Q: boolean; // Obroty poniżej 2 mln EUR
  totalAssetsBelow2M_EUR_________R: boolean; // Suma bilansowa poniżej 2 mln EUR
  qualification__________________S: boolean; // Kwalifikacja
  employmentBelow50______________T: boolean; // Zatrudnienie poniżej 50 osób
  turnoverBelow10M_EUR___________U: boolean; // Obroty poniżej 10 mln EUR
  totalAssetsBelow10M_EUR________V: boolean; // Suma bilansowa poniżej 10 mlnEUR
  qualification__________________W: boolean; // Kwalifikacja
  totalRevenue2022_______________X: number; // Przychody razem 2022
  totalRevenue2023_______________Y: number; // Przychody razem 2023
}
