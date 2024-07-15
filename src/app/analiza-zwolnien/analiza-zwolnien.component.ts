import {Component, Signal, inject, computed} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular'; // Angular Data Grid Component
import {
  ColDef,
  CellValueChangedEvent,
} from 'ag-grid-community'; // Column Definition Type Interface
import {CompanyDataStorageService} from '../company-data-storage.service';
import {TransactionDataStorageService} from '../transaction-data-storage.service';
import {DefaultValuesService} from '../default-values.service';
import {Company} from '../company';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-quartz.css';

@Component({
  selector: 'app-analiza-zwolnien',
  standalone: true,
  imports: [AgGridAngular],
  templateUrl: './analiza-zwolnien.component.html',
  styleUrl: './analiza-zwolnien.component.scss',
})
export class AnalizaZwolnienComponent {
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );

  companyDataStorageService: CompanyDataStorageService = inject(
    CompanyDataStorageService
  );

  defaultValues: DefaultValuesService = inject(DefaultValuesService);

  companies: Signal<Company[]>;

  constructor() {
    this.companies = computed(() => this.companyDataStorageService.companies());
  }

  rowHeight: number = 56; // 42px is default

  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerClass: 'zwolnienia-grid-header',
    width: 200,
    cellStyle: (params) => {
      const styles: any = {
        display: 'flex',
        alignItems: 'center',
      };

      if (params.value === 'TAK') {
        styles.backgroundColor = 'lightgreen';
        styles.color = 'darkgreen';
        styles.textAlign = 'center';
      } else if (params.value === 'NIE') {
        styles.backgroundColor = 'lightcoral';
        styles.color = 'darkred';
        styles.textAlign = 'center';
      }

      return styles;
    },
  };

  onCellValueChanged(event: CellValueChangedEvent) {
    // Get the changed row.
    const updatedCompany = event.data;

    // In case user deleted all cell content - assign a default value
    // Currently only the numeric columns can be set to 'null' by clearing the cell content
    const transactionProperties: string[] = Object.keys(updatedCompany);
    for (let property of transactionProperties) {
      if (updatedCompany[property] === null) {
        updatedCompany[property] = this.defaultValues.noContentAfterEdit;
      }
    }

    // Update the comapnies data stored in a signal wthin a service.
    // console.log(updatedCompany);
    this.companyDataStorageService.updateCompanies(updatedCompany);
  }

  columnDefs: ColDef[] = [
    {
      field: 'entityName____________________A',
      headerName: 'Nazwa podmiotu',
      editable: false,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'text',
      cellStyle: (params) => {
        const styles: any = {
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        };

        // Set text color if displayColor is not 'none'
        if (params.data.displayColor !== 'none') {
          styles.color = params.data.displayColor;
        }

        // Set text to bold if displayBold is true
        if (params.data.displayBold) {
          styles.fontWeight = 'bold';
        }

        return styles;
      },
    },
    {
      headerName: 'Rezultat',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      width: 400,
      cellDataType: 'text',
      valueGetter: (params) => {
        const company: Company = params.data;
        let result = '';

        if (
          company.dctExemptionCapitalSource_____C === 'TAK' &&
          company.dctExemptionCapitalSource_____C ===
          company.dctExemptionOtherSources______D
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła.';
        } else if (
          company.dctExemptionCapitalSource_____C === 'TAK' &&
          company.dctExemptionOtherSources______D === 'NIE'
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe.';
        } else if (
          company.dctExemptionCapitalSource_____C === 'NIE' &&
          company.dctExemptionOtherSources______D === 'TAK'
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła.';
        } else if (
          company.dctExemptionCapitalSource_____C === 'NIE' &&
          company.dctExemptionOtherSources______D === 'NIE'
        ) {
          result = 'Podmiotowi nie przysługuje zwolnienie z obowiązku DCT.';
        }

        if (company.displayBold) {
          result += '\nPodmiot zwolniony z obowiązku benchmarku.';
        } else {
          result +=
            '\nPodmiotowi nie przysługuje zwolnienie z obowiązku benchmarku.';
        }

        return result;
      },
      // autoHeight: true,
      cellStyle: (params) => {
        const styles: any = {
          whiteSpace: 'pre-wrap',
          fontSize: '11px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          lineHeight: 1.6,
        };

        // Set text color if displayColor is not 'none'
        if (params.data.displayColor !== 'none') {
          styles.color = params.data.displayColor;
        }

        // Set text to bold if displayBold is true
        if (params.data.displayBold) {
          styles.fontWeight = 'bold';
        }

        return styles;
      },
    },
    // The fields that remain commented out are not used in the current implementation for visual reasons. But they are used in the original implementation.

    // {
    //   field: 'dctExemptionAllSources________B',
    //   headerName:
    //     'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'dctExemptionCapitalSource_____C',
    //   headerName:
    //     'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'dctExemptionOtherSources______D',
    //   headerName:
    //     'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'benchmarkExemptionSmallMicro__E',
    //   headerName: 'Zwolnienie z obowiązku benchmarku - mały/mikro',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'masterFileObligation___________F',
    //   headerName: 'Obowiązek master file',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'covidExemption_________________G',
    //   headerName: 'Zwolnienie tzw. covidove',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    {
      field: 'taxProfitLossCapitalSources2023_H',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'taxProfitLossOtherSources2023__I',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'pitCITExemption2023____________J',
      headerName:
        'Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {values: ['TAK', 'NIE']},
      cellDataType: 'text',
    },
    {
      field: 'consolidationReport____________K',
      headerName: 'Czy sprawozdanie podlega konsolidacji',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {values: ['TAK', 'NIE']},
      cellDataType: 'text',
    },
    {
      field: 'consolidatedRevenue2022________L',
      headerName: 'Skonsolidowane przychody grupy w 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'averageEmployment2022__________M',
      headerName: 'Średnioroczne zatrudnienie w 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    // {
    //   field: 'netAnnualTurnover2022__________N',
    //   headerName:
    //     'Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022',
    //   editable: false,
    // },
    {
      field: 'totalAssets2022________________O',
      headerName: 'suma aktywów 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    // {
    //   field: 'employmentBelow10______________P',
    //   headerName: 'Zatrudnienie poniżej 10 osób',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'turnoverBelow2M_EUR____________Q',
    //   headerName: 'Obroty poniżej 2 mln EUR',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'totalAssetsBelow2M_EUR_________R',
    //   headerName: 'Suma bilansowa poniżej 2 mln EUR',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'qualification__________________S',
    //   headerName: 'Kwalifikacja',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'employmentBelow50______________T',
    //   headerName: 'Zatrudnienie poniżej 50 osób',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'turnoverBelow10M_EUR___________U',
    //   headerName: 'Obroty poniżej 10 mln EUR',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'totalAssetsBelow10M_EUR________V',
    //   headerName: 'Suma bilansowa poniżej 10 mlnEUR',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    // {
    //   field: 'qualification__________________W',
    //   headerName: 'Kwalifikacja',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    {
      field: 'totalRevenue2022_______________X',
      headerName: 'Przychody razem 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'totalRevenue2023_______________Y',
      headerName: 'Przychody razem 2023',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
  ];
}
