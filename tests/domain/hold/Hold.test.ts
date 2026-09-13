import { describe, expect, it } from 'vitest';
import { Hold } from '../../../src/domain/hold/Hold.js';
import { HoldStatus } from '../../../src/domain/enums/hold.js';
import { Money } from '../../../src/domain/money/Money.js';

describe('Hold', () => {
  const createHold = () =>
    Hold.create('hold-1', 'account-1', new Money(10000n, 'INR'));

  it('creates an active hold', () => {
    const hold = createHold();

    expect(hold.status).toBe(HoldStatus.ACTIVE);
    expect(hold.amount.amount).toBe(10000n);
    expect(hold.accountId).toBe('account-1');
    expect(hold.expiresAt).toBeNull();
  });

  it('creates a hold with an expiration time', () => {
    const expiresAt = new Date('2026-12-01T00:00:00Z');

    const hold = Hold.create(
      'hold-1',
      'account-1',
      new Money(10000n, 'INR'),
      expiresAt
    );

    expect(hold.expiresAt).toEqual(expiresAt);
  });

  it('captures an active hold', () => {
    const hold = createHold();

    hold.capture();

    expect(hold.status).toBe(HoldStatus.CAPTURED);
  });

  it('releases an active hold', () => {
    const hold = createHold();

    hold.release();

    expect(hold.status).toBe(HoldStatus.RELEASED);
  });

  it('expires an active hold', () => {
    const hold = createHold();

    hold.expire();

    expect(hold.status).toBe(HoldStatus.EXPIRED);
  });

  it('cannot capture an already released hold', () => {
    const hold = createHold();

    hold.release();

    expect(() => hold.capture()).toThrow('Only active holds can change status');
  });

  it('cannot release an already captured hold', () => {
    const hold = createHold();

    hold.capture();

    expect(() => hold.release()).toThrow('Only active holds can change status');
  });

  it('cannot expire an already captured hold', () => {
    const hold = createHold();

    hold.capture();

    expect(() => hold.expire()).toThrow('Only active holds can change status');
  });

  it('restores a hold from persistence', () => {
    const createdAt = new Date('2026-01-01T00:00:00Z');
    const expiresAt = new Date('2026-02-01T00:00:00Z');

    const hold = Hold.fromPersistence(
      'hold-1',
      'account-1',
      new Money(5000n, 'INR'),
      HoldStatus.EXPIRED,
      expiresAt,
      createdAt
    );

    expect(hold.status).toBe(HoldStatus.EXPIRED);
    expect(hold.createdAt).toEqual(createdAt);
    expect(hold.expiresAt).toEqual(expiresAt);
  });
});
