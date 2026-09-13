import { describe, expect, it } from 'vitest';
import { Hold } from '../../../src/domain/hold/Hold.js';
import { HoldStatus } from '../../../src/domain/enums/hold.js';
import { Money } from '../../../src/domain/money/Money.js';

describe('Hold', () => {
  it('creates an active hold', () => {
    const amount = new Money(30000n, 'INR');

    const hold = new Hold('hold-1', 'account-1', amount);

    expect(hold.id).toBe('hold-1');
    expect(hold.accountId).toBe('account-1');
    expect(hold.amount).toBe(amount);
    expect(hold.status).toBe(HoldStatus.ACTIVE);
    expect(hold.createdAt).toBeInstanceOf(Date);
  });

  it('rejects a zero amount', () => {
    expect(() => new Hold('hold-1', 'account-1', new Money(0n, 'INR'))).toThrow(
      'Hold amount must be greater than zero'
    );
  });

  it('rejects a negative amount', () => {
    expect(
      () => new Hold('hold-1', 'account-1', new Money(-100n, 'INR'))
    ).toThrow('Money amount cannot be negative');
  });

  it('captures an active hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.capture();

    expect(hold.status).toBe(HoldStatus.CAPTURED);
  });

  it('releases an active hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.release();

    expect(hold.status).toBe(HoldStatus.RELEASED);
  });

  it('cannot capture an already captured hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.capture();

    expect(() => hold.capture()).toThrow('Only active holds can be captured');
  });

  it('cannot release an already released hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.release();

    expect(() => hold.release()).toThrow('Only active holds can be released');
  });

  it('cannot release a captured hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.capture();

    expect(() => hold.release()).toThrow('Only active holds can be released');
  });

  it('cannot capture a released hold', () => {
    const hold = new Hold('hold-1', 'account-1', new Money(30000n, 'INR'));

    hold.release();

    expect(() => hold.capture()).toThrow('Only active holds can be captured');
  });
});
