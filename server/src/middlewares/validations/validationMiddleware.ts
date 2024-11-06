import {z, AnyZodObject, ZodError} from 'zod';
import express, {Request, Response, NextFunction} from 'express';


export const validateParams = (schema: AnyZodObject) => {
    return async(req: Request, res: Response, next: NextFunction) => {
        try{
            await schema.parseAsync({
                query: req.query,
                params: req.params,
                body: req.body
            });
            
            return next();
        }catch(error){
            if(error instanceof ZodError){
                const errorMessages = error.errors.map((issue: any) => ({
                    message: `${issue.path.join('.')} is ${issue.message}`,
                }));
                
                res.status(400).json({error: "Invalid Data", details: errorMessages});
            }else {
                res.status(500).json({error: "Internal Server Error"});
            }
        }
    };
}
    
