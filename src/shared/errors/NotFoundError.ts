import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "Entity does not exist"
 *
 * @see https://tools.ietf.org/html/rfc2616#section-10.4.5
 */
class NotFoundError extends BaseError {
  constructor(entity: string) {
    const message = `${entity} not found`;
    const properties = {
      status: 404,
      code: 'entity_not_found',
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default NotFoundError;
