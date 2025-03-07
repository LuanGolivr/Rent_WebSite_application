import {Router} from 'express';
import * as wishListController from '../controllers/wishListController';
import { AuthMiddleware } from '../auth/authMiddleware';
import { validateParams } from '../middlewares/validations/validationMiddleware.js';
import { addOrDeletePropertyToWishListSchema } from '../schemas/wishListSchema';


const wishListRouter = Router();
const authMiddleware = new AuthMiddleware();

wishListRouter.get("/wishlist", authMiddleware.verifyJWT.bind(authMiddleware), wishListController.getWishList);

wishListRouter.post("/wishlist", validateParams(addOrDeletePropertyToWishListSchema), authMiddleware.verifyJWT.bind(authMiddleware), wishListController.addPropertyToWishList);

wishListRouter.delete("/wishlist", validateParams(addOrDeletePropertyToWishListSchema), authMiddleware.verifyJWT.bind(authMiddleware), wishListController.deletePropertyFromWishList);


export default wishListRouter;