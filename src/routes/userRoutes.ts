import { Router } from "express";
import * as propUser from '../controllers/userController.js';

const userRouter = Router();

userRouter.post('/signup', propUser.createAccount);

userRouter.post('/login', propUser.login);

userRouter.patch('/update', propUser.updateAccount);

userRouter.delete('/delete', propUser.deleteAccount);



export default userRouter;
