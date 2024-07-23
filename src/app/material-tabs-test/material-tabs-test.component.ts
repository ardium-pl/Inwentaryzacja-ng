import { Component, inject, computed } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { TransactionsComponent } from '../transactions/transactions.component';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { DEFAULT_VALUES } from '../default-values';
import { AnalizaZwolnienComponent } from '../analiza-zwolnien/analiza-zwolnien.component';
import { FooterService } from '../footer.service';

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

  readonly footerService = inject(FooterService);

  readonly transactions = computed(() =>
    this.transactionDataStorageService.transactions()
  );

  // Get unique companies
  readonly uniqueCompanies = computed(() => {
    const companies = new Set<string>();

    this.transactions().forEach((transaction) => {
      if (transaction.sellerName !== DEFAULT_VALUES.NO_DATA) {
        companies.add(transaction.sellerName);
      }
      if (transaction.buyerName !== DEFAULT_VALUES.NO_DATA) {
        companies.add(transaction.buyerName);
      }
    });

    return Array.from(companies);
  });

  // Trigger footer
  onTabChange(event: MatTabChangeEvent): void {
    if (event.tab.textLabel === 'Analiza zwolnień') {
      this.footerService.displayFooter.set(false);
    } else {
      this.footerService.displayFooter.set(true);
    }
  }

  readonly PERMANENT_TAB_NAME1: string = 'Transactions MAIN';
  readonly PERMANENT_TAB_NAME2: string = 'Obowiązki CT';
}
