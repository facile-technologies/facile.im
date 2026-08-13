class CustomErrorHandler extends Error {
  constructor(status, message) {
  
    super();
    this.status = status;
    this.message = message;
  }

  static alreadyExist(message) {
    return new CustomErrorHandler(409, message);
  }

  static wrongCredentials(message = "Invalid username or password!") {
    return new CustomErrorHandler(401, message);
  }

  static unAuthorized(message = "Unauthorized") {
    return new CustomErrorHandler(401, message);
  }

  static NotFound(message = "404 not found") {
    return new CustomErrorHandler(404, message);
  }

  static invalidId(message) {
    return new CustomErrorHandler(422, message);
  }
}

export default CustomErrorHandler;
