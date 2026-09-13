import { JournalEntryDirection } from '../enums/journal-entry.js';
import { TransactionStatus, TransactionType } from '../enums/transaction.js';
import { JournalEntry } from '../journal-entry/JournalEntry.js';

export class Transaction {
  readonly id: string;
  readonly type: TransactionType;
  readonly reference: string | null;
  readonly correlationId: string;
  readonly createdAt: Date;

  private _status: TransactionStatus;
  private readonly entries: JournalEntry[] = [];

  constructor(
    id: string,
    type: TransactionType,
    correlationId: string,
    reference: string | null = null
  ) {
    if (!id) {
      throw new Error('Transaction id is required');
    }

    if (!correlationId) {
      throw new Error('Transaction correlation id is required');
    }

    this.id = id;
    this.type = type;
    this.correlationId = correlationId;
    this.reference = reference;

    this._status = TransactionStatus.PENDING;
    this.createdAt = new Date();
  }

  get status(): TransactionStatus {
    return this._status;
  }

  getEntries(): readonly JournalEntry[] {
    return this.entries;
  }

  addEntry(entry: JournalEntry): void {
    if (this._status !== TransactionStatus.PENDING) {
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

  post(): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can be posted');
    }

    if (this.entries.length < 2) {
      throw new Error('Transaction must have at least two entries');
    }

    let totalDebits = 0n;
    let totalCredits = 0n;

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

    this._status = TransactionStatus.POSTED;
  }

  fail(): void {
    if (this._status !== TransactionStatus.PENDING) {
      throw new Error('Only pending transactions can fail');
    }

    if (this.entries.length > 0) {
      throw new Error('Transaction with entries cannot be failed');
    }

    this._status = TransactionStatus.FAILED;
  }

  reverse(): void {
    if (this._status !== TransactionStatus.POSTED) {
      throw new Error('Only posted transactions can be reversed');
    }

    this._status = TransactionStatus.REVERSED;
  }
}
