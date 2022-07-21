export interface HttpErrorType {
  statusCode: number;
  errorObjects: any[];
}

export const httpError = (errorObjects: any[], statusCode: number = 500): HttpErrorType => ({
  statusCode: statusCode,
  errorObjects: errorObjects,
});
