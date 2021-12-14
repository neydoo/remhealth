import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "Entity does not exist or access"
 *
 * @see https://tools.ietf.org/html/rfc2616#section-10.4.5
 */
class InvalidEntity extends BaseError {
  constructor(entity: string) {
    const message = `Invalid ${entity} given`;
    const properties = {
      status: 400,
      code: 'invalid_entity',
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default InvalidEntity;
