export interface HttpErrorType {
  statusCode: number;
  message: string;
  errorObjects: any[];
}

export const httpError = (
  errorObjects: any[],
  message: string = "server_error",
  statusCode: number = 500
): HttpErrorType => ({
  errorObjects: errorObjects,
  message: message,
  statusCode: statusCode,
});
