import type { Money } from "../money/Money.js";
import { JournalEntryDirection } from "../enums/journal-entry.js";

export class JournalEntry {
  readonly id: string;
  readonly transactionId: string;
  readonly accountId: string;
  readonly amount: Money;
  readonly direction: JournalEntryDirection;
  readonly createdAt: Date;

  constructor (
    id: string,
    transactionId: string,
    accountId: string,
    amount: Money,
    direction: JournalEntryDirection
  ) {
    if(amount.amount == 0n){
      throw new Error("Journal entry amount must be greater than zero");
    }

    this.id = id;
    this.transactionId = transactionId;
    this.accountId = accountId;
    this.amount = amount;
    this.direction = direction;
    this.createdAt = new Date();
  }
}