import dotenv from 'dotenv';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import os from 'os';

import postRouter from './routes/postRoutes.js';
import { connectToDatabase } from './database/dbConnection.js';


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

(async ()=>{
    const error = await connectToDatabase();
    if(error){
        console.error('Failed to connect to database', error);
    }
})();

server.get('/', (req: Request, res: Response) =>{
    res.json({msg: os.hostname()});
});

server.use('/api', postRouter);

server.use((req: Request, res: Response)=>{
    res.status(404).json({error: "Endpoint not found"});
});

const errorHandler: ErrorRequestHandler =  (err, req: Request, res: Response, next: NextFunction)=>{

}

server.use(errorHandler);

server.listen(process.env.SERVER_PORT);