import { describe, expect, it } from 'vitest';
import { Money } from '../../../src/domain/money/Money.js';

describe('Money', () => {
  it('creates money with a valid amount and currency', () => {
    const money = new Money(10000n, 'INR');

    expect(money.amount).toBe(10000n);
    expect(money.currency).toBe('INR');
  });

  it('rejects negative amounts', () => {
    expect(() => new Money(-100n, 'INR')).toThrow(
      'Money amount cannot be negative'
    );
  });

  it('adds money with the same currency', () => {
    const first = new Money(10000n, 'INR');
    const second = new Money(2500n, 'INR');

    const result = first.add(second);

    expect(result.amount).toBe(12500n);
    expect(result.currency).toBe('INR');
  });

  it('rejects addition of different currencies', () => {
    const inr = new Money(10000n, 'INR');
    const usd = new Money(1000n, 'USD');

    expect(() => inr.add(usd)).toThrow('Currency Mismatch');
  });

  it('subtracts money with the same currency', () => {
    const balance = new Money(10000n, 'INR');
    const amount = new Money(2500n, 'INR');

    const result = balance.subtract(amount);

    expect(result.amount).toBe(7500n);
  });

  it('does not allow subtraction below zero', () => {
    const balance = new Money(1000n, 'INR');
    const amount = new Money(2500n, 'INR');

    expect(() => balance.subtract(amount)).toThrow(
      'Money amount cannot be negative'
    );
  });

  it('compares two money values', () => {
    const first = new Money(10000n, 'INR');
    const second = new Money(10000n, 'INR');

    expect(first.equals(second)).toBe(true);
  });
});
