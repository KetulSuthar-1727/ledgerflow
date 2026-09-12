export class Currency {
  readonly code: string;
  readonly minorUnit: number;

  constructor(code: string) {
    const normalizeCode = code.toUpperCase();

    if (!/^[A-Z]{3}$/.test(normalizeCode)) {
      throw new Error('Invalid currency code');
    }

    const supportedCurrencies: Record<string, number> = {
      INR: 2,
      USD: 2,
      EUR: 2,
      GBP: 2,
      JPY: 0,
    };

    if (!(normalizeCode in supportedCurrencies)) {
      throw new Error('Unsupported currency');
    }

    this.code = normalizeCode;
    this.minorUnit = supportedCurrencies[normalizeCode]!;
  }
}
