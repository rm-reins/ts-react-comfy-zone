import { StatusCodes } from "http-status-codes";

interface CustomError extends Error {
  statusCode: number;
}

function createCustomError(message: string, statusCode: number): CustomError {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode;
  return error;
}

const BadRequestError = (message: string): CustomError =>
  createCustomError(message, StatusCodes.BAD_REQUEST);
const NotFoundError = (message: string): CustomError =>
  createCustomError(message, StatusCodes.NOT_FOUND);
const UnauthenticatedError = (message: string): CustomError =>
  createCustomError(message, StatusCodes.UNAUTHORIZED);
const UnauthorizedError = (message: string): CustomError =>
  createCustomError(message, StatusCodes.FORBIDDEN);

export {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
  UnauthorizedError,
};
