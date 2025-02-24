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
        await this.verifyToken(req, res, next, token);
    }

    private extractToken(req: Request){
        if(req && req.cookies){
            return req.cookies.jwt;
        }
        return null;
    }

    private async verifyToken(req: Request, res: Response, next: NextFunction, token: string ){
        return jwt.verify(token, this.secretKey, async (error: any, decoded: any) => {
            if(error){
                return res.status(StatusCodes.BAD_REQUEST).json({error});
            }
            const id = decoded.id;
            const user = await prisma.user.findFirst({
                where: {
                    id: id
                }
            });
            if(!user){
                res.status(StatusCodes.NOT_FOUND).json({error: "User does not exist"});
            }
            req.userId = user!.id;
            next();
        });
    }
}

