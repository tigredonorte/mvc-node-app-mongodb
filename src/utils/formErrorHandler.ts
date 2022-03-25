import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const handleInputError =
  (details: { views: string; page: string; title: string; }, params?: { [s: string]: any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    return res.status(422).render(`${details.views}/${details.page}`, {
      ...(params ?? {}),
      docTitle: details.title,
      errorMessage: errors.mapped(),
    });
  };
