import { describe, expect, it } from "vitest";
import { Transaction } from "../../../src/domain/transaction/Transaction.js";
import { JournalEntry } from "../../../src/domain/journal-entry/JournalEntry.js";
import { JournalEntryDirection } from "../../../src/domain/enums/journal-entry.js";
import { TransactionStatus } from "../../../src/domain/enums/transaction.js";
import { Money } from "../../../src/domain/money/Money.js";

describe("Transaction", () => {
    it("creates a pending transaction", () => {
        const transaction = new Transaction("transaction-1");

        expect(transaction.id).toBe("transaction-1");
        expect(transaction.status).toBe(TransactionStatus.PENDING);
        expect(transaction.getEntries()).toHaveLength(0);
        expect(transaction.createdAt).toBeInstanceOf(Date);
    });

    it("adds a journal entry", () => {
        const transaction = new Transaction("transaction-1");

        const entry = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        transaction.addEntry(entry);

        expect(transaction.getEntries()).toHaveLength(1);
        expect(transaction.getEntries()[0]).toBe(entry);
    });

    it("rejects an entry belonging to another transaction", () => {
        const transaction = new Transaction("transaction-1");

        const entry = new JournalEntry(
            "entry-1",
            "transaction-2",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        expect(() => transaction.addEntry(entry))
            .toThrow("Journal entry belongs to a different transaction");
    });

    it("rejects entries with a different currency", () => {
        const transaction = new Transaction("transaction-1");

        const debit = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        const credit = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(10000n, "USD"),
            JournalEntryDirection.CREDIT
        );

        transaction.addEntry(debit);

        expect(() => transaction.addEntry(credit))
            .toThrow("Currency mismatch");
    });

    it("posts a balanced transaction", () => {
        const transaction = new Transaction("transaction-1");

        const debit = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        const credit = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(10000n, "INR"),
            JournalEntryDirection.CREDIT
        );

        transaction.addEntry(debit);
        transaction.addEntry(credit);

        transaction.post();

        expect(transaction.status).toBe(TransactionStatus.POSTED);
    });

    it("rejects a transaction with fewer than two entries", () => {
        const transaction = new Transaction("transaction-1");

        const entry = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        transaction.addEntry(entry);

        expect(() => transaction.post())
            .toThrow("Transaction must have at least two entries");
    });

    it("rejects an unbalanced transaction", () => {
        const transaction = new Transaction("transaction-1");

        const debit = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        const credit = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(8000n, "INR"),
            JournalEntryDirection.CREDIT
        );

        transaction.addEntry(debit);
        transaction.addEntry(credit);

        expect(() => transaction.post())
            .toThrow("Transaction is not balanced");
    });

    it("rejects posting an already posted transaction", () => {
        const transaction = new Transaction("transaction-1");

        const debit = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        const credit = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(10000n, "INR"),
            JournalEntryDirection.CREDIT
        );

        transaction.addEntry(debit);
        transaction.addEntry(credit);

        transaction.post();

        expect(() => transaction.post())
            .toThrow("Only pending transactions can be posted");
    });

    it("fails a pending transaction with no entries", () => {
        const transaction = new Transaction("transaction-1");

        transaction.fail();

        expect(transaction.status).toBe(TransactionStatus.FAILED);
    });

    it("rejects failing a transaction that has entries", () => {
        const transaction = new Transaction("transaction-1");

        const entry = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        transaction.addEntry(entry);

        expect(() => transaction.fail())
            .toThrow("Transaction with entries cannot be failed");
    });

    it("rejects adding entries after posting", () => {
        const transaction = new Transaction("transaction-1");

        const debit = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        const credit = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(10000n, "INR"),
            JournalEntryDirection.CREDIT
        );

        transaction.addEntry(debit);
        transaction.addEntry(credit);
        transaction.post();

        const extraEntry = new JournalEntry(
            "entry-3",
            "transaction-1",
            "account-3",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        expect(() => transaction.addEntry(extraEntry))
            .toThrow("Only pending transactions can add entries");
    });
});