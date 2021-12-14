import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "Something went wrong"
 *
 */
class SomethingWentWrong extends BaseError {
  constructor() {
    const message = `Something went wrong`;
    const properties = {
      status: 500,
      code: 'something_went_wrong',
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default SomethingWentWrong;
