import { NextFunction, Request, Response } from 'express';
import { body } from 'express-validator/check';

import { handleInputError } from '../../../utils/middlewares/errorHandler';
import { UsersModel } from '../user/user.model';

const userModel = new UsersModel();
const views = 'modules/user/auth/views';
export class AuthHandleError {
  static signup = handleInputError({ title: 'Signup', page: 'signup', views });
  static login = handleInputError({ title: 'Create Account', page: 'login', views });
  static reset = (req: Request, res: Response, next: NextFunction) => {
    res.locals.hash = req.params.hash;
    return handleInputError({ title: 'Create Account', page: 'resetPassword', views })(req, res, next);
  };
}

export class AuthValidator {
  static userName = body('name').isLength({ min: 1 }).withMessage('You must fill your name');
  static email = (isSignup: boolean) =>
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .normalizeEmail({ gmail_remove_subaddress: false })
      .custom(async (email) => {
        const result = await userModel.getByEmail(email);
        if (isSignup) {
          if (result) {
            throw new Error(`Email already exists`);
          }
        } else if (!result) {
          throw new Error(`Email doesn't exist`);
        }
        return true;
      });

  static confirm = body('confirm_password').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Passwords have to match`);
    }
    return true;
  });
  static password = body('password')
    .trim()
    .isLength({ min: 8 })
    .withMessage('Type at least 8 characters')
    .matches(/\d/)
    .withMessage('must contain a number')
    .matches(/[a-z]/)
    .withMessage('must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('must contain at least one uppercase letter');

  static signup = [
    AuthValidator.email(true),
    AuthValidator.password,
    AuthValidator.confirm,
    AuthValidator.userName,
    AuthHandleError.signup,
  ];
  static login = [AuthValidator.password, AuthValidator.email(false), AuthHandleError.login];
  static reset = [AuthValidator.password, AuthValidator.confirm, AuthHandleError.reset];
}
