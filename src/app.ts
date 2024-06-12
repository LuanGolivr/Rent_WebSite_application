import dotenv from 'dotenv';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';

import userRouter from './routes/userRoutes.js';
import propertiesRouter from './routes/propertyRoutes.js';
import { connectToDatabase } from './database/dbConnection.js';


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

connectToDatabase()
.then((error) =>{
    if(error){
        console.error('Failed to connect to the database', error);
    }
})
.catch((error)=>{
    console.error('Unexpected error during database connection', error);
});

server.use('/api', userRouter);
server.use('/api', propertiesRouter);

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