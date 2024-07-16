import {Injectable, signal, inject} from '@angular/core';
import {Transaction} from './transaction';
import { DefaultValuesService } from './default-values.service';


@Injectable({
  providedIn: 'root',
})
export class TransactionDataStorageService {
  readonly defaultValues = inject(DefaultValuesService);

  readonly transactions = signal<Transaction[]>([]);

  readonly currentSelection = signal<string>('none')

  readonly LIMITS = new Map<string, number>([
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
    this.currentSelection.set('none');
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
