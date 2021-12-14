import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "entity exists"
 *
 * @see https://tools.ietf.org/html/rfc2616#section-10.4.5
 */
class EntityExists extends BaseError {
  constructor(entity: string) {
    const message = `${entity} already exists`;
    const properties = {
      status: 409,
      code: 'entity_exists',
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default EntityExists;
