import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  readonly displayFooter = signal<boolean>(true);

  // set displayFooter(value: boolean) {
  //   this._displayFooter = value;
  // }

  // get displayFooter(): boolean {
  //   return this._displayFooter;
  // }
}
