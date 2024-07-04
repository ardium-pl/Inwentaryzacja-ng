import {Injectable, signal} from '@angular/core';
import {Transaction} from './transaction';

/**
 * TransactionDataStorageService
 *
 * This service is responsible for storing and managing transaction data.
 * It uses the 'signal' function from '@angular/core' to create a reactive state for the transactions.
 * The 'transactions' state is initialized with a default set of transactions.
 * The service provides methods to update and set the transactions.
 *
 * @property {Signal<Transaction[]>} transactions - The reactive state for the transactions.
 *
 * @method updateTransactions(updatedTransactions: Transaction[]): void
 * Updates the 'transactions' state with the provided 'updatedTransactions'.
 * Logs the updated transactions to the console.
 *
 * @method setTransactions(inputTransactions: Transaction[]): void
 * Sets the 'transactions' state with the provided 'inputTransactions'.
 * Logs the input transactions to the console.
 */

@Injectable({
  providedIn: 'root',
})
export class TransactionDataStorageService {
  transactions = signal<Transaction[]>([]);

  currentSelection: string = 'none';

  limits = new Map<string, number>([
    ['Transakcja towarowa', 10000000.0],
    ['Transakcja finansowa', 10000000.0],
    ['Transakcja usługowa', 2000000.0],
    ['Transakcje "rajowe" finansowe', 2500000.0],
    ['Transakcje "rajowe" inne niż finansowe', 500000.0],
  ]);

  inna_limit: number = 2000000;


  clearAllSelections(): void {
    const updatedTransactions = this.transactions().map(transaction => ({
      ...transaction,
      selection: 'none'
    }));
    this.updateAllTransactions(updatedTransactions);
    this.currentSelection = 'none';
  }

// Dodajmy również metodę do aktualizacji wszystkich transakcji naraz
  updateAllTransactions(transactions: Transaction[]): void {
    this.transactions.set(transactions);
  }

  setTransactions(inputTransactions: Transaction[]) {
    this.transactions.set(inputTransactions);
  }

  updateTransactions(updatedTransaction: Transaction) {
    this.transactions.update((transactions) =>
      transactions.map((txn) =>
        txn.transactionId === updatedTransaction.transactionId
          ? updatedTransaction
          : txn
      )
    );
  }

  setTransactionLimit(inputTransaction: Transaction) {
    // Set the limit for the transaction with the corresponding id
    this.transactions.update((transactions) =>
      transactions.map((txn) => {
        if (txn.transactionId === inputTransaction.transactionId) {
          const limit = this.limits.get(inputTransaction.transactionType);
          return {
            ...txn,
            significanceLimit: limit !== undefined ? limit : this.inna_limit,
          };
        } else {
          return txn;
        }
      })
    );
  }

  setAllTransactionLimits() {
    this.transactions.update((transactions) =>
      transactions.map((txn) => {
        const limit = this.limits.get(txn.transactionType);
        return {
          ...txn,
          significanceLimit: limit !== undefined ? limit : this.inna_limit,
        };
      })
    );
  }
}
