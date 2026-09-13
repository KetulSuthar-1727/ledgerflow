import { describe, expect, it } from "vitest";
import { Currency } from "../../../src/domain/currency/Currency.js";

describe("Currency", () => {

    it("creates INR correctly", () => {
        const currency = new Currency("INR");

        expect(currency.code).toBe("INR");
        expect(currency.minorUnit).toBe(2);
    });

    it("normalizes lowercase currency codes to uppercase", () => {
        const currency = new Currency("inr");

        expect(currency.code).toBe("INR");
        expect(currency.minorUnit).toBe(2);
    });

    it("creates JPY with zero minor units", () => {
        const currency = new Currency("JPY");

        expect(currency.code).toBe("JPY");
        expect(currency.minorUnit).toBe(0);
    });

    it("rejects currency codes that are not exactly three letters", () => {
        expect(() => new Currency("IN"))
            .toThrow("Invalid currency code");

        expect(() => new Currency("USDD"))
            .toThrow("Invalid currency code");

        expect(() => new Currency("12A"))
            .toThrow("Invalid currency code");
    });

    it("rejects unsupported currencies", () => {
        expect(() => new Currency("ABC"))
            .toThrow("Unsupported currency");
    });

    it("supports all currently defined currencies", () => {
        const currencies = [
            { code: "INR", minorUnit: 2 },
            { code: "USD", minorUnit: 2 },
            { code: "EUR", minorUnit: 2 },
            { code: "GBP", minorUnit: 2 },
            { code: "JPY", minorUnit: 0 }
        ];

        for (const expected of currencies) {
            const currency = new Currency(expected.code);

            expect(currency.code).toBe(expected.code);
            expect(currency.minorUnit).toBe(expected.minorUnit);
        }
    });
});