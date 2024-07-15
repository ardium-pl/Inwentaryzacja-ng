import { Component, inject, Signal, computed } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabContentComponent } from '../tab-content/tab-content.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { Transaction } from '../transaction';
import { TransactionDataStorageService } from '../transaction-data-storage.service';
import { DefaultValuesService } from '../default-values.service';
import { AnalizaZwolnienComponent } from '../analiza-zwolnien/analiza-zwolnien.component';


@Component({
  selector: 'app-material-tabs-test',
  standalone: true,
  imports: [
    MatTabsModule,
    TabContentComponent,
    TransactionsComponent,
    AnalizaZwolnienComponent,
    TransactionsComponent,
  ],
  templateUrl: './material-tabs-test.component.html',
  styleUrl: './material-tabs-test.component.scss',
})
export class MaterialTabsTestComponent {
  // Inject the data storage service
  /**
   * transactionDataStorageService is an instance of the TransactionDataStorageService.
   * It is used to fetch and manage transaction data.
   */
  transactionDataStorageService: TransactionDataStorageService = inject(
    TransactionDataStorageService
  );

  defaultValues: DefaultValuesService = inject(DefaultValuesService);

  // Initialize transactions
  /**
   * transactions is a Signal that tracks the transactions from the TransactionDataStorageService.
   */
  transactions: Signal<Transaction[]>;

  constructor() {
    // Set the transactions to track the signal from a service
    /**
     * In the constructor, the transactions Signal is set to track the transactions from the TransactionDataStorageService.
     */
    this.transactions = computed(() =>
      this.transactionDataStorageService.transactions()
    );
  }

  // Get unique companies
  /**
   * uniqueCompanies is a computed property that returns an array of unique company names.
   * It does this by iterating over the transactions and adding the sellerName and buyerName to a Set.
   * The Set is then converted to an array and returned.
   */
  uniqueCompanies = computed(() => {
    const companies = new Set<string>();

    this.transactions().forEach((transaction) => {
      if (transaction.sellerName !== this.defaultValues.noData) {
        companies.add(transaction.sellerName);
      }
      if (transaction.buyerName !== this.defaultValues.noData) {
        companies.add(transaction.buyerName);
      }
    });

    return Array.from(companies);
  });

  permanentTabName1: string = 'Transactions MAIN';
  permanentTabName2: string = 'Obowiązki CT';
}
