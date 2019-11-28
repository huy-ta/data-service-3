import ErrorResponse from "./ErrorResponse";

class BadRequest400 extends ErrorResponse {
  public static generate(message) {
    return super.generate(400, 'Bad Request', message);
  }
}

export default BadRequest400;
