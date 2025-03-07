import {Router} from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { createPropertySchema, updatePropertySchema, deletePropertySchema } from '../schemas/propertySchema.js';
import { AuthMiddleware } from '../auth/authMiddleware.js';

const propertyRouter = Router();
const authMiddleware = new AuthMiddleware();

propertyRouter.get('/property/:id', propertyController.getSingleProperty);

propertyRouter.get('/properties', propertyController.getProperties);

propertyRouter.post('/property', validateParams(createPropertySchema), authMiddleware.verifyJWT.bind(authMiddleware), propertyController.createProperty);

propertyRouter.patch('/property', validateParams(updatePropertySchema), authMiddleware.verifyJWT.bind(authMiddleware), propertyController.updateProperty);

propertyRouter.delete('/property', validateParams(deletePropertySchema), authMiddleware.verifyJWT.bind(authMiddleware), propertyController.deleteProperty);


export default propertyRouter;