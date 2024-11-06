import {Router} from 'express';
import * as propertyController from '../controllers/propertyController.js';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { getManyPropertiesSchema, getsinglePropertySchema } from '../schemas/propertySchema.js';

const propertyRouter = Router();


propertyRouter.get('/property/:id', validateParams(getsinglePropertySchema), propertyController.getSingleProperty);

propertyRouter.get('/properties', validateParams(getManyPropertiesSchema), propertyController.getProperties);

propertyRouter.post('/propperty', propertyController.createProperty);

propertyRouter.post('/properties', propertyController.createManyProperties);

propertyRouter.patch('/property/:id', propertyController.editProperty);

propertyRouter.patch('/properties', propertyController.editManyProperties);

propertyRouter.delete('/property/:id', propertyController.deleteProperty);

propertyRouter.delete('/properties', propertyController.deleteManyProperties);


export default propertyRouter;