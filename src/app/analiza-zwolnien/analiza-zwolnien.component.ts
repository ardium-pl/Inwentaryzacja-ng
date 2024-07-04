import { Component, Input, Signal, inject, computed } from '@angular/core';
import { AgGridAngular } from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
  GridApi,
  GridReadyEvent,
  RowStyle,
} from 'ag-grid-community'; // Column Definition Type Interface
import { CompanyDataStorageService } from '../company-data-storage.service';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { Company } from '../company';
import { Transaction } from '../transaction';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'app-analiza-zwolnien',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './analiza-zwolnien.component.html',
  styleUrl: './analiza-zwolnien.component.css',
})
export class AnalizaZwolnienComponent {
  // Inject the data storage service
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );
  // Inject the company storage service
  companyDataStorageService: CompanyDataStorageService = inject(
    CompanyDataStorageService
  );

  companies: Signal<Company[]>;

  constructor() {
    this.companies = computed(() => this.companyDataStorageService.companies());
  }

  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerClass: 'zwolnienia-grid-header',
    width: 200,
    cellStyle: (params) => {
      if (params.value === true) {
        return {
          backgroundColor: 'lightgreen',
          color: 'darkgreen',
          textAlign: 'center',
        };
      } else if (params.value === false) {
        return {
          backgroundColor: 'lightcoral',
          color: 'darkred',
          textAlign: 'center',
        };
      } else return undefined;
    },
  };

  colDefs: ColDef[] = [
    {
      field: 'entityName____________________A',
      headerName: 'Nazwa podmiotu',
      editable: false,
    },
    {
      field: 'dctExemptionAllSources________B',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła',
      editable: false,
    },
    {
      field: 'dctExemptionCapitalSource_____C',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe',
      editable: false,
    },
    {
      field: 'dctExemptionOtherSources______D',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła',
      editable: false,
    },
    {
      field: 'benchmarkExemptionSmallMicro__E',
      headerName: 'Zwolnienie z obowiązku benchmarku - mały/mikro',
      editable: false,
    },
    {
      field: 'masterFileObligation___________F',
      headerName: 'Obowiązek master file',
      editable: false,
    },
    {
      field: 'covidExemption_________________G',
      headerName: 'Zwolnienie tzw. covidove',
      editable: false,
    },
    {
      field: 'taxProfitLossCapitalSources2023_H',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH',
      editable: true,
    },
    {
      field: 'taxProfitLossOtherSources2023__I',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ',
      editable: true,
    },
    {
      field: 'pitCITExemption2023____________J',
      headerName:
        'Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji',
      editable: true,
    },
    {
      field: 'consolidationReport____________K',
      headerName: 'Czy sprawozdanie podlega konsolidacji',
      editable: true,
    },
    {
      field: 'consolidatedRevenue2022________L',
      headerName: 'Skonsolidowane przychody grupy w 2022',
      editable: true,
    },
    {
      field: 'averageEmployment2022__________M',
      headerName: 'Średnioroczne zatrudnienie w 2022',
      editable: true,
    },
    {
      field: 'netAnnualTurnover2022__________N',
      headerName:
        'Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022',
      editable: false,
    },
    {
      field: 'totalAssets2022________________O',
      headerName: 'suma aktywów 2022',
      editable: true,
    },
    {
      field: 'employmentBelow10______________P',
      headerName: 'Zatrudnienie poniżej 10 osób',
      editable: false,
    },
    {
      field: 'turnoverBelow2M_EUR____________Q',
      headerName: 'Obroty poniżej 2 mln EUR',
      editable: false,
    },
    {
      field: 'totalAssetsBelow2M_EUR_________R',
      headerName: 'Suma bilansowa poniżej 2 mln EUR',
      editable: false,
    },
    {
      field: 'qualification__________________S',
      headerName: 'Kwalifikacja',
      editable: false,
    },
    {
      field: 'employmentBelow50______________T',
      headerName: 'Zatrudnienie poniżej 50 osób',
      editable: false,
    },
    {
      field: 'turnoverBelow10M_EUR___________U',
      headerName: 'Obroty poniżej 10 mln EUR',
      editable: false,
    },
    {
      field: 'totalAssetsBelow10M_EUR________V',
      headerName: 'Suma bilansowa poniżej 10 mlnEUR',
      editable: false,
    },
    {
      field: 'qualification__________________W',
      headerName: 'Kwalifikacja',
      editable: false,
    },
    {
      field: 'totalRevenue2022_______________X',
      headerName: 'Przychody razem 2022',
      editable: true,
    },
    {
      field: 'totalRevenue2023_______________Y',
      headerName: 'Przychody razem 2023',
      editable: true,
    },
  ];
}
