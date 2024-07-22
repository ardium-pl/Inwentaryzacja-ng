import { Injectable, inject } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { Company } from '../company';
import { DefaultValuesService } from '../default-values.service';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefService {
  readonly defaultValues = inject(DefaultValuesService);

  // Default column definitions - global
  defaultColDef: ColDef = {
    wrapHeaderText: true,
    autoHeaderHeight: true,
    headerClass: 'zwolnienia-grid-header',
    width: 200,
    cellStyle: (params) => {
      const styles: any = {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
      };

      if (params.value === 'TAK') {
        styles.backgroundColor = 'lightgreen';
        styles.color = 'darkgreen';
      } else if (params.value === 'NIE') {
        styles.backgroundColor = 'lightcoral';
        styles.color = 'darkred';
      }

      return styles;
    },
  };

  // Column definitions for AG Grid
  colDefs: ColDef[] = [
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
          textAlign: 'center',
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
      editable: false,
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
    {
      field: 'dctExemptionCapitalSource_____C',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'dctExemptionOtherSources______D',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'benchmarkExemptionSmallMicro__E',
      headerName: 'Zwolnienie z obowiązku benchmarku - mały/mikro',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    // {
    //   field: 'masterFileObligation___________F',
    //   headerName: 'Obowiązek master file',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    {
      field: 'covidExemption_________________G',
      headerName: 'Zwolnienie tzw. covidove',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
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
      cellEditorParams: { values: ['TAK', 'NIE'] },
      cellDataType: 'text',
    },
    {
      field: 'consolidationReport____________K',
      headerName: 'Czy sprawozdanie podlega konsolidacji',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
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
    {
      field: 'netAnnualTurnover2022__________N',
      headerName:
        'Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'totalAssets2022________________O',
      headerName: 'suma aktywów 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'employmentBelow10______________P',
      headerName: 'Zatrudnienie poniżej 10 osób',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'turnoverBelow2M_EUR____________Q',
      headerName: 'Obroty poniżej 2 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'totalAssetsBelow2M_EUR_________R',
      headerName: 'Suma bilansowa poniżej 2 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'qualification__________________S',
      headerName: 'Kwalifikacja',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'employmentBelow50______________T',
      headerName: 'Zatrudnienie poniżej 50 osób',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'turnoverBelow10M_EUR___________U',
      headerName: 'Obroty poniżej 10 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'totalAssetsBelow10M_EUR________V',
      headerName: 'Suma bilansowa poniżej 10 mlnEUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'qualification__________________W',
      headerName: 'Kwalifikacja',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
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
