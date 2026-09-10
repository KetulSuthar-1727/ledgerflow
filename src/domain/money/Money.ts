export class Money {
  readonly amount: bigint;
  readonly currency: string;

  constructor(amount: bigint, currency: string) {
    if (amount < 0n) {
      throw new Error('Money amount cannot be negative');
    }
    this.amount = amount;
    this.currency = currency;
  }

  public ensureSameCurrency(other: Money) {
    if (this.currency != other.currency) {
      throw new Error('Currency Mismatch');
    }
  }

  public add(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(this.amount + other.amount, this.currency);
  }

  public subtract(other: Money): Money {
    this.ensureSameCurrency(other);

    return new Money(this.amount - other.amount, this.currency);
  }

  public equals(other: Money): boolean {
    return (
      this.amount == other.amount && this.currency == other.currency
    );
  }
}
