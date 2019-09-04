export { AppError } from './error';

import { complete } from './code';
export const code = { complete };

export const txid = { create: () => String(Math.random()).substr(2) };
