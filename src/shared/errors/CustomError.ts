import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "Custom error: pass error message or code"
 *
 * @see https://tools.ietf.org/html/rfc2616#section-10.4.5
 */
class CustomError extends BaseError {
  constructor(message: string, status = 400, code = 'custom') {
    const properties = {
      status,
      code,
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default CustomError;
