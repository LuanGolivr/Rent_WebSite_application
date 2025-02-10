import {Router} from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { createPropertySchema, updatePropertySchema, deletePropertySchema } from '../schemas/propertySchema.js';

const propertyRouter = Router();

propertyRouter.get('/property/:id', propertyController.getSingleProperty);

propertyRouter.get('/properties', propertyController.getProperties);

propertyRouter.post('/property', validateParams(createPropertySchema), propertyController.createProperty);

propertyRouter.patch('/property', validateParams(updatePropertySchema), propertyController.updateProperty);

propertyRouter.delete('/property', validateParams(deletePropertySchema), propertyController.deleteProperty);


export default propertyRouter;