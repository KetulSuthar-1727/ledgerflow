import type { Currency } from "../currency/Currency.js";
import { AccountType, AccountStatus } from "../enums/account.js";



export class Account {
  readonly id: string;
  readonly ownerId: string;
  readonly currency: Currency;
  type: AccountType;
  status: AccountStatus;

  constructor(id: string, ownerId: string, currency: Currency, type: AccountType){
    this.id = id;
    this.ownerId = ownerId;
    this.currency = currency;
    this.type = type;
    this.status = AccountStatus.ACTIVE;
  }

  activate(): void {
    this.status = AccountStatus.ACTIVE;
  }

  deactivate(): void {
    this.status = AccountStatus.INACTIVE;
  }

  changeType(newType: AccountType): void {
    this.type = newType
  }
}