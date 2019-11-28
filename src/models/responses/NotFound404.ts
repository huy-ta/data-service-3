import ErrorResponse from "./ErrorResponse";

class NotFound404 extends ErrorResponse {
  public static generate(message) {
    return super.generate(404, 'Not Found', message);
  }
}

export default NotFound404;
