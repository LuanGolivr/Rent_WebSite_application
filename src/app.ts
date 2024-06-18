import dotenv from 'dotenv';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import postRouter from './routes/postRoutes.js';
//import userRouter from './routes/userRoutes.js';
//import propertiesRouter from './routes/propertyRoutes.js';
import { connectToDatabase } from './database/dbConnection.js';


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

(async ()=>{
    const error = await connectToDatabase();
    if(error){
        console.error('Failed to connect to database');
    }
})();

//server.use('/api', userRouter);
//server.use('/api', propertiesRouter);
server.use('/api', postRouter);

server.get('/', (req: Request, res: Response)=>{
    res.json({answer: "deu certo"});
});

server.use((req: Request, res: Response)=>{
    res.status(404).json({error: "Endpoint not found"});
});

const errorHandler: ErrorRequestHandler =  (err, req, res, next)=>{

}

server.use(errorHandler);

server.listen(process.env.SERVER_PORT);