import dotenv from 'dotenv';
import express, {Request, Response} from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

import userRouter from './routes/userRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import wishListRouter from './routes/wishListRoutes.js';
import { createClient } from 'redis';


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));

export const prisma = new PrismaClient();
//export const client = createClient().on('error', err => console.log('Redis Client Error', err)).connect();
export const requestQueue: Map<string, Response[]> = new Map<string, Response[]>();

server.get('/', (req: Request, res: Response)=> {
    res.json({answer: true});
});

server.use('/api/v1',userRouter);
server.use('/api/v1',propertyRouter);
server.use('/api/v1', wishListRouter);

server.listen(process.env.PORT);