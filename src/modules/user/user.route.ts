import express from 'express';

import { errorGuard } from '../../utils/route-guard';
import { UserController } from './user/user.controller';

const UserRoutes = express.Router();
const userController = new UserController();

// user admin
UserRoutes.get('/user/list', errorGuard(userController.list));
UserRoutes.get('/user/add', errorGuard(userController.add));
UserRoutes.post('/user/add', errorGuard(userController.addPost));
UserRoutes.get('/user/edit/:id', errorGuard(userController.edit));
UserRoutes.post('/user/edit/:id', errorGuard(userController.editPatch));
UserRoutes.get('/user/delete/:id', errorGuard(userController.delete));
UserRoutes.get('/user/:id', errorGuard(userController.show));

export { UserRoutes };
