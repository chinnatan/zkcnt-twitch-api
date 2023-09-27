class APIException {
  constructor(status, message) {
    this.status = status;
    this.message = message;
    this.name = "APIException";
  }
}

module.exports = APIException