import { describe, expect, it } from 'vitest';

import { Account } from '../../../src/domain/account/Account.js';
import { Currency } from '../../../src/domain/currency/Currency.js';
import {
  AccountNormalBalance,
  AccountOwnerType,
  AccountStatus,
  AccountType,
} from '../../../src/domain/enums/account.js';

describe('Account', () => {
  it('creates a user account correctly', () => {
    const currency = new Currency('INR');

    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      currency,
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    expect(account.id).toBe('account-1');
    expect(account.ownerType).toBe(AccountOwnerType.USER);
    expect(account.ownerId).toBe('user-1');
    expect(account.currency).toBe(currency);
    expect(account.type).toBe(AccountType.USER_WALLET);
    expect(account.normalBalance).toBe(AccountNormalBalance.CREDIT);
    expect(account.status).toBe(AccountStatus.ACTIVE);
  });

  it('creates a system account without an owner', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.SYSTEM,
      null,
      new Currency('INR'),
      AccountType.SYSTEM_FEES,
      AccountNormalBalance.CREDIT
    );

    expect(account.ownerType).toBe(AccountOwnerType.SYSTEM);
    expect(account.ownerId).toBeNull();
  });

  it('rejects a system account with an owner', () => {
    expect(() => {
      new Account(
        'account-1',
        AccountOwnerType.SYSTEM,
        'user-1',
        new Currency('INR'),
        AccountType.SYSTEM_FEES,
        AccountNormalBalance.CREDIT
      );
    }).toThrow('System accounts cannot have an owner');
  });

  it('rejects a non-system account without an owner', () => {
    expect(() => {
      new Account(
        'account-1',
        AccountOwnerType.USER,
        null,
        new Currency('INR'),
        AccountType.USER_WALLET,
        AccountNormalBalance.CREDIT
      );
    }).toThrow('Non-system accounts must have an owner');
  });

  it('creates new accounts as active', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    expect(account.status).toBe(AccountStatus.ACTIVE);
  });

  it('freezes an active account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.freeze();

    expect(account.status).toBe(AccountStatus.FROZEN);
  });

  it('unfreezes a frozen account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.freeze();
    account.unfreeze();

    expect(account.status).toBe(AccountStatus.ACTIVE);
  });

  it('closes an account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.close();

    expect(account.status).toBe(AccountStatus.CLOSED);
  });

  it('changes the account type', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.changeType(AccountType.MERCHANT_REVENUE);

    expect(account.type).toBe(AccountType.MERCHANT_REVENUE);
  });

  it('cannot freeze a non-active account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.freeze();

    expect(() => account.freeze()).toThrow(
      'Only active accounts can be frozen'
    );
  });

  it('cannot unfreeze an active account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    expect(() => account.unfreeze()).toThrow(
      'Only frozen accounts can be unfrozen'
    );
  });

  it('cannot close an already closed account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.close();

    expect(() => account.close()).toThrow('Account is already closed');
  });

  it('cannot change the type of a closed account', () => {
    const account = new Account(
      'account-1',
      AccountOwnerType.USER,
      'user-1',
      new Currency('INR'),
      AccountType.USER_WALLET,
      AccountNormalBalance.CREDIT
    );

    account.close();

    expect(() => account.changeType(AccountType.MERCHANT_REVENUE)).toThrow(
      'Closed accounts cannot change type'
    );
  });
});
