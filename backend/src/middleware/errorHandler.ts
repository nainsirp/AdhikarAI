import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/customErrors';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isProduction = process.env.NODE_ENV === 'production';

  if (err instanceof AppError) {
    logger.warn(`Operational Error: [${err.statusCode}] ${err.message}`);
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
  }

  // Handle uncaught or programming errors
  logger.error(`Uncaught Programming Error: ${err.message}`, err.stack);
  
  return res.status(500).json({
    status: 'error',
    message: isProduction ? 'An unexpected error occurred.' : err.message
  });
};
export default errorHandler;
