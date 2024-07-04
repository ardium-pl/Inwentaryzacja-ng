import { Injectable, signal } from '@angular/core';
import { Company } from './company';

@Injectable({
  providedIn: 'root',
})
export class CompanyDataStorageService {
  companies = signal<Company[]>([]);

  setCompanies(comapnies: Company[]) {
    this.companies.set(comapnies);
  }

  constructor() {}
}
