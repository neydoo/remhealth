import BaseError from './BaseError';

/**
 * Constructor.
 *
 * "Service not available"
 *
 * @see https://tools.ietf.org/html/rfc2616#section-10.4.5
 */
class ServiceNotAvailable extends BaseError {
  constructor(entity?: string) {
    const message = !entity
      ? `Service not available`
      : `${entity} service not available`;
    const properties = {
      status: 500,
      code: 'service_not_available',
    };
    super(message, properties);

    this.message = message;
    this.name = this.constructor.name;
  }
}

export default ServiceNotAvailable;
