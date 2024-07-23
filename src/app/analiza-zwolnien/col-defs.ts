import { ColDef } from 'ag-grid-community';
import { Company } from '../company';

export class companyColumnDefinitions {
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
      field: 'A_entityName',
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
          company.C_dctExemptionCapitalSource === 'TAK' &&
          company.C_dctExemptionCapitalSource ===
            company.D_dctExemptionOtherSources
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła.';
        } else if (
          company.C_dctExemptionCapitalSource === 'TAK' &&
          company.D_dctExemptionOtherSources === 'NIE'
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe.';
        } else if (
          company.C_dctExemptionCapitalSource === 'NIE' &&
          company.D_dctExemptionOtherSources === 'TAK'
        ) {
          result =
            'Podmiot zwolniony z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła.';
        } else if (
          company.C_dctExemptionCapitalSource === 'NIE' &&
          company.D_dctExemptionOtherSources === 'NIE'
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
    //   field: 'B_dctExemptionAllSources',
    //   headerName:
    //     'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - wszystkie źródła',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    {
      field: 'C_dctExemptionCapitalSource',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - źródło kapitałowe',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'D_dctExemptionOtherSources',
      headerName:
        'Zwolnienie z obowiązku DCT (zwolnienie krajowe) - pozostałe źródła',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'E_benchmarkExemptionSmallMicro',
      headerName: 'Zwolnienie z obowiązku benchmarku - mały/mikro',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    // {
    //   field: 'F_masterFileObligation',
    //   headerName: 'Obowiązek master file',
    //   editable: false,
    //   cellEditor: 'agSelectCellEditor',
    //   cellEditorParams: { values: ['TAK', 'NIE'] },
    // },
    {
      field: 'G_covidExemption',
      headerName: 'Zwolnienie tzw. covidove',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'H_taxProfitLossCapitalSources2023',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. ZE ŹRÓDEŁ KAPITAŁOWYCH',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'I_taxProfitLossOtherSources2023',
      headerName: 'Zysk/Strata PODATKOWA w 2023 r. Z INNYCH ŹRÓDEŁ',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'J_pitCITExemption2023',
      headerName:
        'Czy podmiot/spółka korzystał/a w 2023 ze zwolnień z PIT/CIT: 1) podmiotowych lub 2) dla SSE/Polskiej Strefy Inwestycji',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      cellDataType: 'text',
    },
    {
      field: 'K_consolidationReport',
      headerName: 'Czy sprawozdanie podlega konsolidacji',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      cellDataType: 'text',
    },
    {
      field: 'L_consolidatedRevenue2022',
      headerName: 'Skonsolidowane przychody grupy w 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'M_averageEmployment2022',
      headerName: 'Średnioroczne zatrudnienie w 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'N_netAnnualTurnover2022',
      headerName:
        'Roczny obrót netto ze sprzedaży towarów, wyrobów i usług oraz z operacji finansowych 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'O_totalAssets2022',
      headerName: 'suma aktywów 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'P_employmentBelow10',
      headerName: 'Zatrudnienie poniżej 10 osób',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'Q_turnoverBelow2M_EUR',
      headerName: 'Obroty poniżej 2 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'R_totalAssetsBelow2M_EUR',
      headerName: 'Suma bilansowa poniżej 2 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'S_qualification',
      headerName: 'Kwalifikacja',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'T_employmentBelow50',
      headerName: 'Zatrudnienie poniżej 50 osób',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'U_turnoverBelow10M_EUR',
      headerName: 'Obroty poniżej 10 mln EUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'V_totalAssetsBelow10M_EUR',
      headerName: 'Suma bilansowa poniżej 10 mlnEUR',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'W_qualification',
      headerName: 'Kwalifikacja',
      editable: false,
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: { values: ['TAK', 'NIE'] },
      headerClass: 'testing-hidden-columns-values',
    },
    {
      field: 'X_totalRevenue2022',
      headerName: 'Przychody razem 2022',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
    {
      field: 'Y_totalRevenue2023',
      headerName: 'Przychody razem 2023',
      editable: true,
      headerClass: 'zwolnienia-grid-header',
      cellDataType: 'number',
    },
  ];
}
