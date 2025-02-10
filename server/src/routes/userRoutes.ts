import {Router} from 'express';

import * as userController from '../controllers/userController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { loginUserSchema, registerUserSchema } from '../schemas/userSchema.js';
import passport from 'passport';
import { AuthMiddleware } from '../auth/authMiddleware.js';

const userRouter = Router();
const authMiddleware = new AuthMiddleware();

userRouter.post('/user/signup', validateParams(registerUserSchema), userController.createUser);

userRouter.post('/user/login', validateParams(loginUserSchema), userController.login);

userRouter.get('/user/logout', userController.logout);

userRouter.get('/user/:id', authMiddleware.verifyJWT.bind(authMiddleware), userController.getUser);

userRouter.put('/user/edit/:id', userController.editUser);

userRouter.delete('/user/:id', userController.deleteUser);

export default userRouter;