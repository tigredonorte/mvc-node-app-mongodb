import express from 'express';
import { AuthController } from './auth/auth.controller';

const AuthRoutes = express.Router();
const authController = new AuthController();

// user authentication
AuthRoutes.get('/login', authController.login);
AuthRoutes.post('/login', authController.loginPost);
AuthRoutes.get('/signup', authController.signup);
AuthRoutes.post('/signup', authController.signupPost);
AuthRoutes.get('/logout', authController.logout);
AuthRoutes.get('/', authController.index);

export { AuthRoutes };
