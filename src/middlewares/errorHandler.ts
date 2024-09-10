import { NextFunction, Response, Request, ErrorRequestHandler } from "express";
import { ErrorApp } from "../Error/ErrorApp";

const errorHandler: ErrorRequestHandler = (err:Error, req:Request, res:Response, next:NextFunction) => {
  const { status = 500, message } = err instanceof ErrorApp ? err : { message: err.message };
  
  res.status(status).json({
    error: message,
    status,
  });
};

export { errorHandler };
