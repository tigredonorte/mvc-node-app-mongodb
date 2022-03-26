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

export const unhandledError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  const msg = err.message ? err.message : null;
  res.status(500).render('modules/index/views/500', { docTitle: 'Internal server error', docContent: msg });
};

export const notFoundError = (req: Request, res: Response) => res.status(404).render('modules/index/views/404', { docTitle: 'Page not found' });