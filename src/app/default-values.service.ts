import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DefaultValuesService {
  // version 1
  NO_DATA: string = 'Brak wartości wejściowej';
  NO_TRANSACTION_DATA: string = 'Brak nazwy transakcji';
  NO_DATA_NUMERIC: number = NaN;
  NO_CONTENT_AFTER_EDIT_NUMERIC: number = 0; // Replaces null
  NO_CONTENT_AFTER_EDIT_TEXT: string = 'Brak wartości wejściowej'; // Replaces null

}
