import express from 'express';

import { AuthController } from './auth/auth.controller';
import { AuthValidator } from './auth/auth.validators';

const AuthRoutes = express.Router();
const authController = new AuthController();

// user authentication
AuthRoutes.get('/login', authController.login);
AuthRoutes.post('/login', AuthValidator.login, authController.loginPost);
AuthRoutes.get('/signup', authController.signup);
AuthRoutes.post('/signup', AuthValidator.signup, authController.signupPost);
AuthRoutes.get('/reset/:hash', authController.resetPassword);
AuthRoutes.post('/reset/:hash', AuthValidator.reset, authController.resetPasswordPost);
AuthRoutes.get('/reset', authController.reset);
AuthRoutes.post('/reset', AuthValidator.email(false), authController.resetPost);
AuthRoutes.get('/logout', authController.logout);
AuthRoutes.get('/', authController.index);

export { AuthRoutes };
