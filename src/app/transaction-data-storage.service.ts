import {Injectable, signal, inject} from '@angular/core';
import {Transaction} from './transaction';
import { DefaultValuesService } from './default-values.service';

/**
 * TransactionDataStorageService
 *
 * This service is responsible for storing and managing transaction data.
 * It uses the 'signal' function from '@angular/core' to create a reactive state for the transactions.
 * The 'transactions' state is initialized with a default set of transactions.
 * The service provides methods to update and set the transactions, clear all selections, update all transactions at once,
 * update a specific transaction, set a transaction limit for a specific transaction, and set transaction limits for all transactions.
 *
 * @property {signal<Transaction[]>} transactions - The reactive state for the transactions.
 * @property {string} currentSelection - Tracks the current selection filter applied to transactions.
 * @property {Map<string, number>} LIMITS - A map defining the significance limits for different types of transactions.
 * @property {number} INNA_LIMIT - Default limit for transactions not explicitly defined in the `limits` map.
 *
 * @method updateTransactions(updatedTransaction: Transaction): void
 * Updates a specific transaction within the transactions state.
 *
 * @method setTransactions(inputTransactions: Transaction[]): void
 * Sets the transactions state with a provided list of transactions.
 *
 * @method clearAllSelections(): void
 * Clears the selection for all transactions, resetting their selection state to 'none'.
 *
 * @method updateAllTransactions(transactions: Transaction[]): void
 * Updates the entire list of transactions with a new set of transactions.
 *
 * @method setTransactionLimit(inputTransaction: Transaction): void
 * Sets the significance limit for a specific transaction based on its type.
 *
 * @method setAllTransactionLimits(): void
 * Applies significance limits to all transactions based on their types.
 */

@Injectable({
  providedIn: 'root',
})
export class TransactionDataStorageService {
  readonly defaultValues = inject(DefaultValuesService);

  readonly transactions = signal<Transaction[]>([]);

  currentSelection: string = 'none';

  readonly LIMITS= new Map<string, number>([
    ['Transakcja towarowa', 10000000.0],
    ['Transakcja finansowa', 10000000.0],
    ['Transakcja usługowa', 2000000.0],
    ['Transakcje "rajowe" finansowe', 2500000.0],
    ['Transakcje "rajowe" inne niż finansowe', 500000.0],
    [this.defaultValues.noTransactionData, NaN],
  ]);

  readonly INNA_LIMIT: number = 2000000;

  clearAllSelections(): void {
    const updatedTransactions = this.transactions().map((transaction) => ({
      ...transaction,
      selection: 'none',
    }));
    this.setTransactions(updatedTransactions);
    this.currentSelection = 'none';
  }

  setTransactions(inputTransactions: Transaction[]): void {
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
          const limit = this.LIMITS.get(inputTransaction.transactionType);
          return {
            ...txn,
            significanceLimit: limit !== undefined ? limit : this.INNA_LIMIT,
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
        const limit = this.LIMITS.get(txn.transactionType);
        return {
          ...txn,
          significanceLimit: limit !== undefined ? limit : this.INNA_LIMIT,
        };
      })
    );
  }
}
