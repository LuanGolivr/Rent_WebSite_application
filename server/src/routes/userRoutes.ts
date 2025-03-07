import {Router} from 'express';
import * as userController from '../controllers/userController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { 
    checkUpdateSensitiveDataTokenSchema, 
    deleteAccountSchema, 
    loginUserSchema, 
    registerUserSchema, 
    requestEditSensitiveDataSchema, 
    updateNonSensitiveDataSchema, 
    updateSensitiveDataSchema 
} from '../schemas/userSchema.js';
import { AuthMiddleware } from '../auth/authMiddleware.js';

const userRouter = Router();
const authMiddleware = new AuthMiddleware();

userRouter.post('/user/signup', validateParams(registerUserSchema), userController.createUser);

userRouter.post('/user/requestActivationToken', userController.requestActivationToken);

userRouter.get('/user/active/:activeToken/:id', userController.activeAccount);

userRouter.post('/user/request/edit/sensitive/data', validateParams(requestEditSensitiveDataSchema), userController.requestEditSensitiveDataReset);

userRouter.post("/user/check/sensitive/data/token", validateParams(checkUpdateSensitiveDataTokenSchema), userController.checkResetSensitiveDataToken);

userRouter.post('/user/edit/senstive/data', validateParams(updateSensitiveDataSchema), userController.editSensitiveData);

userRouter.post('/user/login', validateParams(loginUserSchema), userController.login);

userRouter.get('/user/logout', authMiddleware.verifyJWT.bind(authMiddleware), userController.logout);

userRouter.get('/user/profile/:id', userController.getUser);

userRouter.put('/user/edit/data', validateParams(updateNonSensitiveDataSchema), authMiddleware.verifyJWT.bind(authMiddleware), userController.editNonSensitiveData);

userRouter.delete('/user/delete', validateParams(deleteAccountSchema), authMiddleware.verifyJWT.bind(authMiddleware), userController.deleteUser);

export default userRouter;