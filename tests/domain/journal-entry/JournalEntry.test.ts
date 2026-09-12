import { describe, expect, it } from "vitest";
import { JournalEntry } from "../../../src/domain/journal-entry/JournalEntry.js";
import { Money } from "../../../src/domain/money/Money.js";
import { JournalEntryDirection } from "../../../src/domain/enums/journal-entry.js";

describe("JournalEntry", () => {

    it("creates a debit journal entry correctly", () => {
        const amount = new Money(10000n, "INR");

        const entry = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            amount,
            JournalEntryDirection.DEBIT
        );

        expect(entry.id).toBe("entry-1");
        expect(entry.transactionId).toBe("transaction-1");
        expect(entry.accountId).toBe("account-1");
        expect(entry.amount).toBe(amount);
        expect(entry.direction).toBe(JournalEntryDirection.DEBIT);
    });

    it("creates a credit journal entry correctly", () => {
        const entry = new JournalEntry(
            "entry-2",
            "transaction-1",
            "account-2",
            new Money(10000n, "INR"),
            JournalEntryDirection.CREDIT
        );

        expect(entry.direction).toBe(JournalEntryDirection.CREDIT);
    });

    it("rejects a zero amount", () => {
        expect(() => new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(0n, "INR"),
            JournalEntryDirection.DEBIT
        )).toThrow("Journal entry amount must be greater than zero");
    });

    it("creates a timestamp when the entry is created", () => {
        const entry = new JournalEntry(
            "entry-1",
            "transaction-1",
            "account-1",
            new Money(10000n, "INR"),
            JournalEntryDirection.DEBIT
        );

        expect(entry.createdAt).toBeInstanceOf(Date);
    });

});