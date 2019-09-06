import traverse from 'traverse';
import deepExtend from 'deep-extend';
import { AppError } from './error';
import toSpaces from 'to-space-case';

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

type CompletedRoot<T> = {
    [key in keyof T]: Completed<T[key]>
  };


const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);
const messageFromCode = (code: string) => code.split(/\s*\.\s*/).map(term => capitalize(toSpaces(term))).join('. ') + '.';

export function complete<T extends Uncompleted>(codeObject: T): CompletedRoot<T>;
export function complete<T extends Uncompleted, B extends Uncompleted>(base: T, codeObject: B): CompletedRoot<T> & CompletedRoot<B>;
export function complete<T extends Uncompleted, B extends Uncompleted>(o1: T, o2?: B): CompletedRoot<T & B> {
  const target = deepExtend({}, o1, o2);
  traverse(target).forEach(function (value) {
    if (value && typeof (value) === 'object' && this.path.length > 0) {
      const code = this.path.join('.');
      const node = {
        message: messageFromCode(code), // Build a default message
        ...value,
        code,
        is: Is,
        new: New
      };
      this.update(node);
    }
  });
  return <CompletedRoot<T & B>><unknown> target;
}
