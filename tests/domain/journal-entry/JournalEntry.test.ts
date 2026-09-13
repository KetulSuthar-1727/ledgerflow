import { describe, expect, it } from 'vitest';

import { JournalEntry } from '../../../src/domain/journal-entry/JournalEntry.js';
import { JournalEntryDirection } from '../../../src/domain/enums/journal-entry.js';
import { Money } from '../../../src/domain/money/Money.js';

describe('JournalEntry', () => {
  it('creates a debit journal entry correctly', () => {
    const entry = JournalEntry.create(
      'entry-1',
      'transaction-1',
      'account-1',
      new Money(10000n, 'INR'),
      JournalEntryDirection.DEBIT
    );

    expect(entry.id).toBe('entry-1');
    expect(entry.transactionId).toBe('transaction-1');
    expect(entry.accountId).toBe('account-1');
    expect(entry.amount.amount).toBe(10000n);
    expect(entry.amount.currency).toBe('INR');
    expect(entry.direction).toBe(JournalEntryDirection.DEBIT);
    expect(entry.createdAt).toBeInstanceOf(Date);
  });

  it('creates a credit journal entry correctly', () => {
    const entry = JournalEntry.create(
      'entry-1',
      'transaction-1',
      'account-1',
      new Money(5000n, 'INR'),
      JournalEntryDirection.CREDIT
    );

    expect(entry.direction).toBe(JournalEntryDirection.CREDIT);
  });

  it('rejects an empty journal entry id', () => {
    expect(() =>
      JournalEntry.create(
        '',
        'transaction-1',
        'account-1',
        new Money(10000n, 'INR'),
        JournalEntryDirection.DEBIT
      )
    ).toThrow('Journal entry id is required');
  });

  it('rejects an empty transaction id', () => {
    expect(() =>
      JournalEntry.create(
        'entry-1',
        '',
        'account-1',
        new Money(10000n, 'INR'),
        JournalEntryDirection.DEBIT
      )
    ).toThrow('Journal entry transaction id is required');
  });

  it('rejects an empty account id', () => {
    expect(() =>
      JournalEntry.create(
        'entry-1',
        'transaction-1',
        '',
        new Money(10000n, 'INR'),
        JournalEntryDirection.DEBIT
      )
    ).toThrow('Journal entry account id is required');
  });

  it('rejects a zero amount', () => {
    expect(() =>
      JournalEntry.create(
        'entry-1',
        'transaction-1',
        'account-1',
        new Money(0n, 'INR'),
        JournalEntryDirection.DEBIT
      )
    ).toThrow('Journal entry amount must be greater than zero');
  });

  it('creates an entry from persistence correctly', () => {
    const createdAt = new Date('2026-08-01T10:00:00.000Z');

    const entry = JournalEntry.fromPersistence(
      'entry-1',
      'transaction-1',
      'account-1',
      new Money(10000n, 'INR'),
      JournalEntryDirection.CREDIT,
      createdAt
    );

    expect(entry.id).toBe('entry-1');
    expect(entry.transactionId).toBe('transaction-1');
    expect(entry.accountId).toBe('account-1');
    expect(entry.amount.amount).toBe(10000n);
    expect(entry.amount.currency).toBe('INR');
    expect(entry.direction).toBe(JournalEntryDirection.CREDIT);
    expect(entry.createdAt).toBe(createdAt);
  });

  it('preserves the original persistence timestamp', () => {
    const createdAt = new Date('2026-01-15T08:30:00.000Z');

    const entry = JournalEntry.fromPersistence(
      'entry-1',
      'transaction-1',
      'account-1',
      new Money(25000n, 'INR'),
      JournalEntryDirection.DEBIT,
      createdAt
    );

    expect(entry.createdAt.getTime()).toBe(createdAt.getTime());
  });
});
