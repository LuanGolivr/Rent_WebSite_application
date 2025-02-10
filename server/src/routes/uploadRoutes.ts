import {Router} from 'express';
import * as uploadController from '../controllers/uploadController';
import multer from 'multer';

const uploadRoutes = Router();
const uploadFilesHandler = multer({dest: "./server/public/data/server_imgs"});

uploadRoutes.post('/property/upload', uploadFilesHandler.array('files'), uploadController.uploadImageOrVideo);

uploadRoutes.delete('/property/upload', uploadController.deleteImageOrVideo);

//uploadRoutes.delete();

export default uploadRoutes;