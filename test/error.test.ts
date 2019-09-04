import { AppError } from '../src';

describe('AppError', () => {
  test('toJSON', () => {
    let gerr = new TypeError('Generic error');
    let app1 = new AppError('App error 1', 'app1', { 'app': 1 }, gerr);
    let app2 = new AppError('App error 2', 'app2', { 'app': 2 }, app1);

    let reconstructed = <AppError>JSON.parse(JSON.stringify(app2));

    expect(reconstructed.name).toBe('AppError');
    expect(reconstructed.message).toBe('App error 2');
    expect(reconstructed.code).toBe('app2');
    expect(reconstructed.stack).toBeTruthy();
    expect(reconstructed.info.app).toBe(2);

    let cause = <AppError>reconstructed.cause;

    expect(cause.name).toBe('AppError');
    expect(cause.message).toBe('App error 1');
    expect(cause.stack).toBeTruthy();
    expect(cause.code).toBe('app1');
    expect(cause.info.app).toBe(1);

    let causeOfCause = cause.cause;

    expect(causeOfCause).toBeTruthy();
    if (causeOfCause) {
      expect(causeOfCause.name).toBe('TypeError');
      expect(causeOfCause.message).toBe('Generic error');
      expect(causeOfCause.stack).toBeTruthy();
    }
  });
});
