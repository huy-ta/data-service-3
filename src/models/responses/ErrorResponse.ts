class ErrorResponse {
  public static generate(statusCode: number, error: string, message: string) {
    return {
      statusCode,
      error,
      message
    };
  }
}

export default ErrorResponse;
