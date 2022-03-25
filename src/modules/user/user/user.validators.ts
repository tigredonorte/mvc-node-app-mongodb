import { body } from 'express-validator/check';

export const emailValidator = body('email').isEmail().withMessage('Please enter a valid email');
const nameValidator = body('name').isLength({ min: 1 }).withMessage('You must fill your name');

export const passwordValidator = body('password')
  .isLength({ min: 8 })
  .withMessage('Type at least 8 characters')
  .matches(/\d/)
  .withMessage('must contain a number')
  .matches(/[a-z]/)
  .withMessage('must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('must contain at least one uppercase letter');

export const confirmPasswordValidator = body('confirm_password').custom((value, { req }) => {
  console.log('here');
  if (value !== req.body.password) {
    throw new Error(`Passwords have to match`);
  }
});

export const SignupValidator = [passwordValidator, confirmPasswordValidator, nameValidator, emailValidator];
export const LoginValidator = [passwordValidator, emailValidator];
