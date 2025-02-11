import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';

import { prisma } from "../app";
import { MailService } from "../services/mail";

dotenv.config();
const mail = new MailService();

export const createUser = async (req: Request, res: Response)=> {
    try {
        const newUserInfos = req.body;
        const user = await prisma.user.findFirst({
            where: {
                cpf: newUserInfos.cpf
            }
        });
        if(user === null){
            const passwordHashed = await bcrypt.hash(newUserInfos.password, 8);
            newUserInfos.password = passwordHashed;
            crypto.randomBytes(20, async (err, buf)=>{
                const user = await prisma.user.create({
                    data: newUserInfos
                });
                const activeToken = user.id + buf.toString('hex');
                const activeExpires = Date.now() + 24 * 3600* 1000;
                const link: string = `http://localhost:3000/api/v1/user/active/${newUserInfos.activeToken}`;
                await prisma.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        activeToken,
                        activeExpires
                    }
                });
                mail.sendActivationCode({
                    to: "luangoncalvesoliveira@gmail.com",
                    subject: "Welcome",
                    html: `Please click <a href="${link}"> here </a> to activate your account.`
                });
            });
            res.status(StatusCodes.CREATED).json({message: "User created successfully !!"});
        }else{
            res.status(StatusCodes.CONFLICT).json({message: "User does already exist !!!"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const activeAccount = async (req: Request, res: Response)=>{
    try {
        const activeToken = req.params.activeToken;
        const user = await prisma.user.findFirst({
            where: {
                activeToken: activeToken,
            }
        });
        if(user && !user.isVerified && user.activeExpires >= Date.now()){
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true
                }
            });
            res.status(StatusCodes.OK).json({message: "activation success!"});
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({message: "fail to activate or your account is already active"});
        }        
    } catch (error) {
        console.log('double shit')
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export const login = async (req: Request, res: Response)=>{
    try {
        const formInfos = req.body;
        const user = await prisma.user.findFirst({
            where: {
                email: formInfos.email,
            }
        });
        if(user){
            const passwordIsValid = await bcrypt.compare(formInfos.password, user.password);
            if(!passwordIsValid){
                res.status(StatusCodes.UNAUTHORIZED).json({message: "Password is wrong"});
            }
            const id: string = user.id;
            const secretKey: string = process.env.JWT_SECRET as string;
            const token = jwt.sign({id}, secretKey, { expiresIn: "1d" });
            res.cookie('jwt', token, {
                httpOnly: true,
                secure: process.env.HTTPS_ONLY_SECURE === "production" ? true : false,
                sameSite: 'strict',
                path: '/',
                maxAge: 86400000
            });
            const {password, activeExpires, activeToken, ...userInfos} = user;
            res.status(StatusCodes.OK).json({data: userInfos});
        }
        res.status(StatusCodes.NOT_FOUND).json({message: 'User not found or email is incorrect'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt');
        res.status(StatusCodes.OK).json({message: 'succssefully logout'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const getUser = async (req: Request, res: Response)=> {
    try {
        res.json({ping: true});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const editUser = async (req: Request, res: Response)=> {
    try {
        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const deleteUser = async (req: Request, res: Response)=> {
    try {
        
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};