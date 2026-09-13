import { JournalEntryDirection } from '../enums/journal-entry.js';
import { TransactionStatus } from '../enums/transaction.js';
import { JournalEntry } from '../journal-entry/JournalEntry.js';

export class Transaction {
  readonly id: string;
  status: TransactionStatus;
  private readonly entries: JournalEntry[] = [];
  readonly createdAt: Date;

  constructor(id: string) {
    this.id = id;
    this.status = TransactionStatus.PENDING;
    this.createdAt = new Date();
  }

  getEntries(): readonly JournalEntry[] {
    return this.entries;
  }

  addEntry(entry: JournalEntry) {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can add entries');
    }

    if (entry.transactionId !== this.id) {
      throw new Error('Journal entry belongs to a different transaction');
    }

    if (
      this.entries.length > 0 &&
      entry.amount.currency !== this.entries[0]!.amount.currency
    ) {
      throw new Error('Currency mismatch');
    }

    this.entries.push(entry);
  }

  post() {
    let totalDebits = 0n;
    let totalCredits = 0n;

    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be posted');
    }

    if (this.entries.length < 2) {
      throw new Error('Transaction must have at least two entries');
    }

    for (const entry of this.entries) {
      if (entry.direction === JournalEntryDirection.DEBIT) {
        totalDebits += entry.amount.amount;
      }
      if (entry.direction === JournalEntryDirection.CREDIT) {
        totalCredits += entry.amount.amount;
      }
    }
    if (totalDebits !== totalCredits) {
      throw new Error('Transaction is not balanced');
    }
    this.status = TransactionStatus.POSTED;
  }

  fail() {
    if (this.status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can fail');
    }

    if (this.entries.length > 0) {
      throw new Error('Transaction with entries cannot be failed');
    }

    this.status = TransactionStatus.FAILED;
  }
}
