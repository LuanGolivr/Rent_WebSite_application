import {Router, Request, Response} from 'express';
import * as userController from '../controllers/userController.js';

const userRouter = Router();

userRouter.get('/user/:id', userController.getUser);

userRouter.post('/user/signup', userController.createUser);

userRouter.put('/user/edit/:id', userController.editUser);

userRouter.delete('/user/:id', userController.deleteUser);

export default userRouter;