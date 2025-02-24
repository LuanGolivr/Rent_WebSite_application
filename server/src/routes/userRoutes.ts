import {Router} from 'express';
import * as userController from '../controllers/userController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { deleteAccountSchema, loginUserSchema, registerUserSchema, updateNonSensitiveDataSchema } from '../schemas/userSchema.js';
import { AuthMiddleware } from '../auth/authMiddleware.js';

const userRouter = Router();
const authMiddleware = new AuthMiddleware();

userRouter.post('/user/signup', validateParams(registerUserSchema), userController.createUser);

userRouter.post('/user/requestActivationToken', userController.requestActivationToken);

userRouter.get('/user/active/:activeToken', userController.activeAccount);

//userRouter.post('/user/requestPasswordReset', validateParams(requestPasswordResetSchema), userController.requestPasswordReset);

//userRouter.post('/user/resetPassword', validateParams(resetPasswordSchema), userController.resetPassword);

userRouter.post('/user/login', validateParams(loginUserSchema), userController.login);

userRouter.get('/user/logout', authMiddleware.verifyJWT.bind(authMiddleware), userController.logout);

userRouter.get('/user/profile/:id', userController.getUser);

userRouter.put('/user/edit/data', validateParams(updateNonSensitiveDataSchema), authMiddleware.verifyJWT.bind(authMiddleware), userController.editNonSensitiveData);

userRouter.delete('/user/delete', validateParams(deleteAccountSchema), authMiddleware.verifyJWT.bind(authMiddleware), userController.deleteUser);

export default userRouter;