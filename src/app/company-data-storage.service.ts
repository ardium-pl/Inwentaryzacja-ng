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

  updateCompanies(updatedCompany: Company) {
    this.companies.update((companies) =>
      companies.map((company) =>
        company.companyId === updatedCompany.companyId
          ? updatedCompany
          : company
      )
    );
  }
}
