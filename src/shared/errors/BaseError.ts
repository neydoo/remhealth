interface Property {
  status: number;
  code: string;
}

class BaseError extends Error {
  status: number;

  code: string;

  isCustom = true;

  constructor(message: string, properties?: Property) {
    super(message);

    this.message = message;
    this.status = properties.status;
    this.code = properties.code;

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
  }
}

export default BaseError;
