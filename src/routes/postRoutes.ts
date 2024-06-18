import {Router} from 'express';
import * as postController from '../controllers/postController.js';

const postRouter = Router();

postRouter.get('/post/:id', postController.getSinglePost);

postRouter.get('/post', postController.getManyPosts);

postRouter.post('/post', postController.insertSinglePost);

postRouter.post('/post/many', postController.insertManyPost);

postRouter.patch('/post', postController.updateSinglePost);

postRouter.delete('/post', postController.deleteSinglePost);

postRouter.delete('/post/many', postController.deleteManyPosts);

postRouter.post('/post/database', postController.feedDatabase);

export default postRouter;

