//@ts-ignore
import { Response } from 'express';

export const sendSuccess = (
  res: Response,
  data: any,
  message: string = 'Success',
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (
  res: Response,
  error: any,
  message: string = 'Error',
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    error: error.message || error,
  });
};
