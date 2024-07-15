import {Injectable} from '@angular/core';
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
  noData: string = 'Brak wartości wejściowej';
  noTransactionData: string = 'Brak nazwy transakcji';
  noDataNumeric: number = NaN;
  noContentAfterEdit: number = 0; // Replaces null
  constructor() {
  }
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
