import { NextFunction, Request, Response } from "express";
import { AppError, CustomError } from '../helpers/errors.helper';

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      data: err?.data,
    });
  }

  // FOR UNHANDLED ERRORS
return res.status(500).json({
    message: err.message,
});
};

export default errorHandler;
