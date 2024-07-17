import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FooterService {
  readonly displayFooter = signal<boolean>(true);
}
