import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const handleInputError =
  (details: { views: string; page: string; title: string; bodyName: string }, params?: { [s: string]: any }) =>
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!params) {
      params = {};
    }

    if (details.bodyName) {
      params[details.bodyName] = req.body;
    }

    if (!errors.isEmpty()) {
      return res.status(422).render(`${details.views}/${details.page}`, {
        ...(params ?? {}),
        docTitle: details.title,
        errorMessage: errors.mapped(),
      });
    }
    next();
  };
