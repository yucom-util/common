export class AppError extends Error {

  public readonly code: string;
  public readonly info?: any;
  public readonly cause?: Error;

  constructor(message: string, code: string, info?: any, cause?: Error) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.info = info;
    this.cause = cause;
  }

  public toJSON(): any {
    return errorToJSON(this);
  }
}

type AnyError = {
  name: string;
  message: string;
  stack?: string;
  code?: string;
  info?: any;
  cause?: AnyError;
};

function errorToJSON(err: AnyError): any {
  return {
    name: err.name,
    message: err.message,
    code: err.code,
    stack: err.stack,
    info: err.info,
    cause: err.cause ? errorToJSON(err.cause) : undefined,
  };
}
