import dotenv from 'dotenv';
import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express';
import cors from 'cors';


dotenv.config();
const server = express();

server.use(cors());
server.use(express.json());
server.use(express.urlencoded({extended: true}));

server.get('/', (req: Request, res: Response)=>{
    res.json({answer: "deu certo"});
})

server.use((req: Request, res: Response)=>{
    res.status(404).json({error: "Endpoint not found"});
});

const errorHandler: ErrorRequestHandler =  (err, req, res, next)=>{

}

server.use(errorHandler);

server.listen(8000);