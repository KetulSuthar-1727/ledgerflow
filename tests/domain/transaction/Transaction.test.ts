import { describe, expect, it } from 'vitest';

import { Transaction } from '../../../src/domain/transaction/Transaction.js';
import {
  TransactionStatus,
  TransactionType,
} from '../../../src/domain/enums/transaction.js';
import { JournalEntry } from '../../../src/domain/journal-entry/JournalEntry.js';
import { JournalEntryDirection } from '../../../src/domain/enums/journal-entry.js';
import { Money } from '../../../src/domain/money/Money.js';

describe('Transaction', () => {
  const createDebitEntry = (
    transactionId: string,
    id: string = 'entry-1'
  ): JournalEntry => {
    return new JournalEntry(
      id,
      transactionId,
      'account-1',
      new Money(10000n, 'INR'),
      JournalEntryDirection.DEBIT
    );
  };

  const createCreditEntry = (
    transactionId: string,
    id: string = 'entry-2'
  ): JournalEntry => {
    return new JournalEntry(
      id,
      transactionId,
      'account-2',
      new Money(10000n, 'INR'),
      JournalEntryDirection.CREDIT
    );
  };

  it('creates a pending transaction correctly', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    expect(transaction.id).toBe('transaction-1');
    expect(transaction.type).toBe(TransactionType.TRANSFER);
    expect(transaction.correlationId).toBe('correlation-1');
    expect(transaction.reference).toBeNull();
    expect(transaction.status).toBe(TransactionStatus.PENDING);
    expect(transaction.getEntries()).toHaveLength(0);
  });

  it('creates a transaction with a reference', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.DEPOSIT,
      'correlation-1',
      'bank-deposit-123'
    );

    expect(transaction.reference).toBe('bank-deposit-123');
  });

  it('adds a journal entry to a pending transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    const entry = createDebitEntry('transaction-1');

    transaction.addEntry(entry);

    expect(transaction.getEntries()).toHaveLength(1);
    expect(transaction.getEntries()[0]).toBe(entry);
  });

  it('rejects a journal entry belonging to another transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    const entry = createDebitEntry('transaction-2');

    expect(() => transaction.addEntry(entry)).toThrow(
      'Journal entry belongs to a different transaction'
    );
  });

  it('rejects journal entries with different currencies', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    const firstEntry = createDebitEntry('transaction-1', 'entry-1');

    const secondEntry = new JournalEntry(
      'entry-2',
      'transaction-1',
      'account-2',
      new Money(10000n, 'USD'),
      JournalEntryDirection.CREDIT
    );

    transaction.addEntry(firstEntry);

    expect(() => transaction.addEntry(secondEntry)).toThrow(
      'Currency mismatch'
    );
  });

  it('posts a balanced transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));
    transaction.addEntry(createCreditEntry('transaction-1'));

    transaction.post();

    expect(transaction.status).toBe(TransactionStatus.POSTED);
  });

  it('rejects posting a transaction with fewer than two entries', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));

    expect(() => transaction.post()).toThrow(
      'Transaction must have at least two entries'
    );
  });

  it('rejects posting an unbalanced transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));

    const creditEntry = new JournalEntry(
      'entry-2',
      'transaction-1',
      'account-2',
      new Money(5000n, 'INR'),
      JournalEntryDirection.CREDIT
    );

    transaction.addEntry(creditEntry);

    expect(() => transaction.post()).toThrow('Transaction is not balanced');
  });

  it('fails a pending transaction without entries', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.WITHDRAWAL,
      'correlation-1'
    );

    transaction.fail();

    expect(transaction.status).toBe(TransactionStatus.FAILED);
  });

  it('does not allow a transaction with entries to fail', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));

    expect(() => transaction.fail()).toThrow(
      'Transaction with entries cannot be failed'
    );
  });

  it('reverses a posted transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));
    transaction.addEntry(createCreditEntry('transaction-1'));

    transaction.post();
    transaction.reverse();

    expect(transaction.status).toBe(TransactionStatus.REVERSED);
  });

  it('does not allow a pending transaction to be reversed', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    expect(() => transaction.reverse()).toThrow(
      'Only posted transactions can be reversed'
    );
  });

  it('does not allow a failed transaction to be reversed', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.fail();

    expect(() => transaction.reverse()).toThrow(
      'Only posted transactions can be reversed'
    );
  });

  it('does not allow entries to be added after posting', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));
    transaction.addEntry(createCreditEntry('transaction-1'));

    transaction.post();

    expect(() =>
      transaction.addEntry(
        new JournalEntry(
          'entry-3',
          'transaction-1',
          'account-3',
          new Money(10000n, 'INR'),
          JournalEntryDirection.DEBIT
        )
      )
    ).toThrow('Only pending transactions can add entries');
  });

  it('does not allow posting an already posted transaction', () => {
    const transaction = new Transaction(
      'transaction-1',
      TransactionType.TRANSFER,
      'correlation-1'
    );

    transaction.addEntry(createDebitEntry('transaction-1'));
    transaction.addEntry(createCreditEntry('transaction-1'));

    transaction.post();

    expect(() => transaction.post()).toThrow(
      'Only pending transactions can be posted'
    );
  });
});
