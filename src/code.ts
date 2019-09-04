import traverse from 'traverse';
import deepExtend from 'deep-extend';
import { AppError } from './error';

type Uncompleted = {
  [key in string]: Uncompleted | string;
};

type ErrorInfo = {
  code: string;
  message: string;
};

const Is = function (this: ErrorInfo, maybeError: any): boolean {
  if (!maybeError) return false;
  let code: string;
  if (typeof(maybeError) === 'string') {
    code = maybeError;
  } else {
    if (!maybeError.code) return false;
    code = String(maybeError.code);
  }
  return code === this.code || code.startsWith(this.code + '.');
};

const New = function (this: ErrorInfo, info?: any, cause?: Error): AppError {
  return new AppError(this.message, this.code, info, cause);
};

type Completed<T> = ErrorInfo &
  {
    [key in keyof T]: Completed<T[key]>
  } & {
    is: typeof Is;
    new: typeof New;
  };

export function complete<T extends Uncompleted>(codeObject: T): Completed<T>;
export function complete<T extends Uncompleted, B extends Uncompleted>(base: T, codeObject: B): Completed<T> & Completed<B>;
export function complete<T extends Uncompleted, B extends Uncompleted>(o1: T, o2?: B): Completed<T & B> {
  const target = deepExtend({}, o1, o2);
  traverse(target).forEach(function (value) {
    if (value && typeof (value) === 'object' && this.path.length > 0) {
      const code = this.path.join('.');
      const node = {
        message: code, // Code is used as default message
        ...value,
        code,
        is: Is,
        new: New
      };
      this.update(node);
    }
  });
  return <Completed<T & B>><unknown> target;
}
