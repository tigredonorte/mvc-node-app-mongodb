import express from 'express';

import { AuthController } from './auth/auth.controller';
import { confirmPasswordValidator, emailValidator, LoginValidator, passwordValidator, SignupValidator } from './user/user.validators';

const AuthRoutes = express.Router();
const authController = new AuthController();


// user authentication
AuthRoutes.get('/login', authController.login);
AuthRoutes.post('/login', LoginValidator, authController.loginPost);
AuthRoutes.get('/signup', authController.signup);
AuthRoutes.post('/signup', SignupValidator, authController.signupPost);
AuthRoutes.get('/reset/:hash', authController.resetPassword);
AuthRoutes.post('/reset/:hash', [passwordValidator, confirmPasswordValidator], authController.resetPasswordPost);
AuthRoutes.get('/reset', authController.reset);
AuthRoutes.post('/reset', emailValidator, authController.resetPost);
AuthRoutes.get('/logout', authController.logout);
AuthRoutes.get('/', authController.index);

export { AuthRoutes };
