import { Component, inject, Signal, computed } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TabContentComponent } from '../tab-content/tab-content.component';
import { TransactionsComponent } from '../transactions/transactions.component';
import { Transaction } from '../transaction';
import { TransactionDataStorageService } from '../transaction-data-storage.service';

/**
 * MaterialTabsTestComponent is a component that tests the functionality of Angular Material Tabs.
 * It uses the MatTabsModule for the tabs functionality.
 * It also uses the TabContentComponent and TransactionsComponent as part of its template.
 * The component uses the TransactionDataStorageService to fetch and manage transaction data.
 */

@Component({
  selector: 'app-material-tabs-test',
  standalone: true,
  imports: [MatTabsModule, TabContentComponent, TransactionsComponent],
  templateUrl: './material-tabs-test.component.html',
  styleUrl: './material-tabs-test.component.css',
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
      if (transaction.sellerName) {
        companies.add(transaction.sellerName);
      }
      if (transaction.buyerName) {
        companies.add(transaction.buyerName);
      }
    });

    return Array.from(companies);
  });

  permanentTabName1: string = 'Transactions MAIN';
  permanentTabName2: string = 'Obowiązki CT';
}
