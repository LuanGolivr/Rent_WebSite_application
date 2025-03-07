import {Router} from 'express';
import * as uploadController from '../controllers/uploadController';
import multer from 'multer';
import { AuthMiddleware } from '../auth/authMiddleware';

const authMiddleware = new AuthMiddleware();
const uploadRoutes = Router();
const uploadFilesHandler = multer({dest: "./server/public/data/server_imgs"});

uploadRoutes.post('/property/upload', uploadFilesHandler.array('files'), authMiddleware.verifyJWT.bind(authMiddleware), uploadController.uploadImageOrVideo);

uploadRoutes.delete('/property/upload', authMiddleware.verifyJWT.bind(authMiddleware), uploadController.deleteImageOrVideo);


export default uploadRoutes;