import { Component, inject, computed } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TransactionsComponent } from '../transactions/transactions.component';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { DefaultValuesService } from '../default-values.service';
import { AnalizaZwolnienComponent } from '../analiza-zwolnien/analiza-zwolnien.component';

@Component({
  selector: 'app-material-tabs-test',
  standalone: true,
  imports: [
    MatTabsModule,
    TransactionsComponent,
    AnalizaZwolnienComponent,
    TransactionsComponent,
  ],
  templateUrl: './material-tabs-test.component.html',
  styleUrl: './material-tabs-test.component.scss',
})
export class MaterialTabsTestComponent {
  readonly transactionDataStorageService = inject(
    TransactionDataStorageService
  );

  readonly defaultValues = inject(DefaultValuesService);

  readonly transactions = computed(() =>
    this.transactionDataStorageService.transactions()
  );

  // Get unique companies
  readonly uniqueCompanies = computed(() => {
    const companies = new Set<string>();

    this.transactions().forEach((transaction) => {
      if (transaction.sellerName !== this.defaultValues.NO_DATA) {
        companies.add(transaction.sellerName);
      }
      if (transaction.buyerName !== this.defaultValues.NO_DATA) {
        companies.add(transaction.buyerName);
      }
    });

    return Array.from(companies);
  });

  readonly PERMANENT_TAB_NAME1: string = 'Transactions MAIN';
  readonly PERMANENT_TAB_NAME2: string = 'Obowiązki CT';
}
