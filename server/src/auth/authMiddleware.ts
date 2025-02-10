import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prisma } from '../app';


dotenv.config();

export class AuthMiddleware {
    private secretKey: string = process.env.JWT_SECRET as string;

    public async verifyJWT(req: Request, res: Response, next: NextFunction){
        const token = this.extractToken(req);
        console.log('token', token);
        await this.verifyToken(req, res, next, token);
    }

    private extractToken(req: Request){
        if(req && req.cookies){
            return req.cookies.jwt;
        }
        return null;
    }

    private async verifyToken(req: Request, res: Response, next: NextFunction, token: string ){
        return jwt.verify(token, this.secretKey, async (err: any, decoded: any) => {
            if(err){
                return res.status(StatusCodes.BAD_REQUEST).json({error: err});
            }
            req.body.id = decoded.id;
            const user = prisma.user.findFirst({
                where: {
                    id: req.body.id
                }
            });
            if(!user){
                res.status(StatusCodes.BAD_REQUEST).json({error: "User does not exist"});
            }
            next();
        });
    }
}

