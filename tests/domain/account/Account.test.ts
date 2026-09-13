import { describe, expect, it } from 'vitest';
import { Account } from '../../../src/domain/account/Account.js';
import { Currency } from '../../../src/domain/currency/Currency.js';
import {
  AccountStatus,
  AccountType,
} from '../../../src/domain/enums/account.js';

describe('Account', () => {
  it('creates an account correctly', () => {
    const currency = new Currency('INR');

    const account = new Account(
      'account-1',
      'user-1',
      currency,
      AccountType.USER_WALLET
    );

    expect(account.id).toBe('account-1');
    expect(account.ownerId).toBe('user-1');
    expect(account.currency).toBe(currency);
    expect(account.type).toBe(AccountType.USER_WALLET);
  });

  it('creates new accounts as active', () => {
    const account = new Account(
      'account-1',
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET
    );

    expect(account.status).toBe(AccountStatus.ACTIVE);
  });

  it('deactivates an account', () => {
    const account = new Account(
      'account-1',
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET
    );

    account.deactivate();

    expect(account.status).toBe(AccountStatus.INACTIVE);
  });

  it('activates an account', () => {
    const account = new Account(
      'account-1',
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET
    );

    account.deactivate();
    account.activate();

    expect(account.status).toBe(AccountStatus.ACTIVE);
  });

  it('changes the account type', () => {
    const account = new Account(
      'account-1',
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET
    );

    account.changeType(AccountType.MERCHANT_REVENUE);

    expect(account.type).toBe(AccountType.MERCHANT_REVENUE);
  });
});
