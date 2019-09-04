import { txid } from '../src';

describe('TxID', () => {
  test('Create: txid must be big', () => {
    expect(txid.create().length > 10).toBeTruthy();
  });
  test('Create: different calls give different results', () => {
    expect(txid.create()).not.toBe(txid.create());
  });
});
