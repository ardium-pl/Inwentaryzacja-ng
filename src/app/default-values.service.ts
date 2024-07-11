import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DefaultValuesService {
  noData: string = 'Brak wartości wejściowej';
  noTransactionData: string = 'Brak nazwy transakcji';
  noDataNumeric: number = NaN;
  noContentAfterEdit: number = 0; // Replaces null
  constructor() {
  }
}
