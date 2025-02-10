import passport from "passport";
import dotenv from 'dotenv';
import { StatusCodes } from "http-status-codes";
import {ExtractJwt, Strategy, StrategyOptionsWithoutRequest, StrategyOptionsWithRequest} from 'passport-jwt';
import {Request} from 'express'


import { prisma } from "../app";
dotenv.config();

function TokenExtractor(req: Request){
    let token = null;

    if(req && req.cookies){
        token = req.cookies['jwt'];
    }

    return token;
};


const opts = {
    jwtFromRequest: TokenExtractor,
    secretOrKey: process.env.JWT_SECRET as string
};

passport.use(
    new Strategy(opts, async (payload, done) => {
        try {
            const user = prisma.user.findUnique({
                where: {
                    id: payload.id
                }
            });

            if(user){
                return done(null, user);
            }else{
                return done({
                    status: StatusCodes.UNAUTHORIZED,
                    message: "Not Authorized"
                }, false);
            }
        } catch (error) {
            return done(error);
        }
    })
);

export default passport;




