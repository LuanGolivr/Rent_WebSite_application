import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from "../app";
import { MailService } from "../services/mail";
import { createRandomNanoId, createRandomToken } from "../utils";
import { CacheSystem } from "../services/cacheSystem";

dotenv.config();
const mail = new MailService();
const activationCodesCache = new CacheSystem();
const sensitiveDataCache = new CacheSystem();

export const createUser = async (req: Request, res: Response)=> {
    try {
        const newUserInfos = req.body;
        const user = await prisma.user.findFirst({
            where: {
                cpf: newUserInfos.cpf
            }
        });
        
        if(user === null){
            console.log('here')
            const passwordHashed: string = await bcrypt.hash(newUserInfos.password, 8);
            newUserInfos.password = passwordHashed;
            const user = await prisma.user.create({
                data: newUserInfos
            });
            const activeToken: string = createRandomToken(user.id);
            const activeExpires: number = Date.now() + 24 * 3600* 1000;
            const link: string = `http://localhost:3000/api/v1/user/active/${activeToken}/${user.id}`;
            activationCodesCache.setData(user.id, activeToken, activeExpires);
            await mail.send({
                to: user.email,
                subject: "Welcome",
                html: `Please click <a href="${link}"> here </a> to activate your account.`
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
        const userId = req.params.id;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: userId,
            }
        });
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"});
        }
        if(user.isVerified){
            res.status(StatusCodes.CONFLICT).json({message: "fail to activate or your account is already active"});
        }
        if(await activationCodesCache.keyExists(userId) && activeToken === await activationCodesCache.getData(userId)){
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true
                }
            });
            await activationCodesCache.deleteData(user.id);
            res.status(StatusCodes.OK).json({message: "activation success!"});
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({message: "Activation token has expired, request a new one!"});
        }   
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export const requestActivationToken = async (req: Request, res: Response) => {
    try {
        const userId: string = req.body.id;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: userId
            }
        });
        const activeToken: string = createRandomToken(user.id);
        const activeExpires: number = Date.now() + 24 * 3600* 1000;
        const link: string = `http://localhost:3000/api/v1/user/active/${activeToken}/${user.id}`;
        activationCodesCache.setData(user.id, activeToken, activeExpires);
        mail.send({
            to: user.email,
            subject: "Welcome",
            html: `Please click <a href="${link}"> here </a> to activate your account.`
        });
        res.status(StatusCodes.OK).json({message: "The new activation code was sent to you e-mail"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const requestEditSensitiveDataReset = async (req: Request, res: Response)=>{
    try {
        const userEmail: string = req.body.email;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                email: userEmail
            }
        });
        if(user){
            const token: string = createRandomNanoId();
            const resetPasswordExpires: number = Date.now() + 24 * 3600* 1000;
            await sensitiveDataCache.setData(user.email, token, resetPasswordExpires);
            mail.send({
                to: user.email,
                subject: "Password reset request",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please copy and paste the token bellow into your browser to continue the process:\n\n
                    ${token}\n\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            });
            res.status(StatusCodes.OK);
        }
        res.status(StatusCodes.NOT_FOUND).json({message: "Email not registered in our system!!"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const checkResetSensitiveDataToken = async (req: Request, res: Response) => {
    try {
        const token: string = req.body.token;
        const email: string = req.body.email;
        if(await sensitiveDataCache.keyExists(email) && await sensitiveDataCache.getData(email) === token){
            res.status(StatusCodes.OK);
        }else{
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json("The token has expired or a wrong token was provided");
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
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
            const {password, isVerified, cpf, ...userInfos} = user;
            res.status(StatusCodes.OK).json({data: userInfos});
        }else{
            res.status(StatusCodes.NOT_FOUND).json({message: 'User not found or email is incorrect'});
        }
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
        const id: string = req.params.id;
        const user = await prisma.user.findFirst({
            where: {
                id: id
            }
        });
        if(user){
            const {password, isVerified, cpf, ...userInfos} = user;
            res.status(StatusCodes.OK).json(userInfos);
        }else{
            res.status(StatusCodes.NOT_FOUND).json({message: "User was not found"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const editNonSensitiveData = async (req: Request, res: Response)=> {
    try {
        const authId = req.userId;
        const userInfos = req.body;
        if(userInfos.id === authId){
            const user = await prisma.user.update({
                where: {
                    id: userInfos.id
                },
                data: userInfos
            });
            const {password, cpf, ...userUpdatedInfos} = user;
            res.status(StatusCodes.OK).json({userUpdatedInfos});
        }else{
            res.status(StatusCodes.FORBIDDEN).json({message: "The given id is not the same as yours"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const editSensitiveData = async (req: Request, res: Response) => {
    try {
        const {token, ...data} = req.body;
        let user = await prisma.user.findUniqueOrThrow({
            where:{
                email: data.email
            }
        });
        if(await sensitiveDataCache.keyExists(user.email) && await sensitiveDataCache.getData(user.email) === token){
            if(data.password){
                const passwordHashed: string = await bcrypt.hash(data.password, 8);
                data.password = passwordHashed;
            }
            user = await prisma.user.update({
                where: {
                    id: user.id
                },
                data: data
            });
            await sensitiveDataCache.deleteData(user.email); 
            res.status(StatusCodes.OK).json("Sensitive data has been updated successfully!!!");
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const deleteUser = async (req: Request, res: Response)=> {
    try {
        const authId = req.userId;
        const userId: string = req.body.id;
        if(authId === userId){
            await prisma.user.delete({
                where: {
                    id: userId
                }
            });
            res.status(StatusCodes.OK).json("User deleted succssefully !!");
        }
        res.status(StatusCodes.FORBIDDEN).json({message: "The given id is not the same as yours"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

