import express from 'express';
import { errorGuard } from '../../utils/route-guard';

import { AuthController } from './auth/auth.controller';
import { AuthValidator } from './auth/auth.validators';

const AuthRoutes = express.Router();
const authController = new AuthController();

// user authentication
AuthRoutes.get('/login', errorGuard(authController.login));
AuthRoutes.post('/login', AuthValidator.login,  errorGuard(authController.loginPost));
AuthRoutes.get('/signup', errorGuard(authController.signup));
AuthRoutes.post('/signup', AuthValidator.signup, errorGuard(authController.signupPost));
AuthRoutes.get('/reset/:hash', errorGuard(authController.resetPassword));
AuthRoutes.post('/reset/:hash', AuthValidator.reset, errorGuard(authController.resetPasswordPost));
AuthRoutes.get('/reset', errorGuard(authController.reset));
AuthRoutes.post('/reset', AuthValidator.email(false), errorGuard(authController.resetPost));
AuthRoutes.get('/logout', errorGuard(authController.logout));
AuthRoutes.get('/', errorGuard(authController.index));

export { AuthRoutes };
