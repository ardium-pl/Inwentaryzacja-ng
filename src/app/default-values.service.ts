import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DefaultValuesService {
  // // version 2
  // private _noData = new BehaviorSubject<string>('Brak wartości wejściowej');
  // private _noTransactionData = new BehaviorSubject<string>('Brak nazwy transakcji');
  // private _noDataNumeric = new BehaviorSubject<number>(NaN);
  // private _noContentAfterEdit = new BehaviorSubject<number>(0); // Replaces null

  // version 1
  NO_DATA: string = 'Brak wartości wejściowej';
  NO_TRANSACTION_DATA: string = 'Brak nazwy transakcji';
  NO_DATA_NUMERIC: number = NaN;
  NO_COMPANY_DATA: null = null;
  COMPANY_DATA_PLACEHOLDER_NUMERIC: string = '-';
  COMPANY_DATA_PLACEHOLDER_BOOLEAN: string = 'Wybierz wartość';
  NO_CONTENT_AFTER_EDIT_NUMERIC: number = 0; // Replaces null
  NO_CONTENT_AFTER_EDIT_TEXT: string = 'Brak wartości wejściowej'; // Replaces null
  //
  // // Setters
  // setNoData(value: string) {
  //   this._noData.next(value);
  // }
  //
  // setNoTransactionData(value: string) {
  //   this._noTransactionData.next(value);
  // }
  //
  // setNoDataNumeric(value: number) {
  //   this._noDataNumeric.next(value);
  // }
  //
  // setNoContentAfterEdit(value: number) {
  //   this._noContentAfterEdit.next(value);
  // }
}
