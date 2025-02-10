import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerOutput from './swagger_output.json';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';

import express, {Application, Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import userRouter from './routes/userRoutes.js';
import propertyRouter from './routes/propertyRoutes.js';
import wishListRouter from './routes/wishListRoutes.js';
import uploadRoutes from './routes/uploadRoutes';

import { CacheSystem } from './services/cacheSystem';

dotenv.config();
const app: Application = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOutput));


export const prisma = new PrismaClient();
export const requestQueue: Map<string, Response[]> = new Map<string, Response[]>();
export const cache: CacheSystem = new CacheSystem();

app.get('/api/v1', (req: Request, res: Response)=> {
    res.status(StatusCodes.OK).json({answer: true});
});

app.use('/api/v1',userRouter);
app.use('/api/v1',propertyRouter);
app.use('/api/v1', uploadRoutes);
app.use('/api/v1', wishListRouter);

app.listen(process.env.PORT);