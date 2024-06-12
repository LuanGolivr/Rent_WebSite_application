import {Router} from 'express';

import * as propController from '../controllers/propertyController.js';

const propertiesRouter = Router();

propertiesRouter.get('/property/:id', propController.getSingleProperty);

propertiesRouter.get('/properties', propController.getProperties);

propertiesRouter.get('/properties/recent',  propController.getRecentProperties);

propertiesRouter.get('/properties/cheap', propController.getCheapProperties);

propertiesRouter.get('/properties/expensive', propController.getExpensiveProperties);

propertiesRouter.get('/properties/favorites', propController.getFavoritesProperties);


export default propertiesRouter;