import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

import { prisma } from "../app";
import { MailService } from "../services/mail";
import { createRandomToken } from "../utils";

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
            const passwordHashed: string = await bcrypt.hash(newUserInfos.password, 8);
            newUserInfos.password = passwordHashed;
            const user = await prisma.user.create({
                data: newUserInfos
            });
            await setActivationToken(user.id);
            res.status(StatusCodes.CREATED).json({message: "User created successfully !!"});
        }
        res.status(StatusCodes.CONFLICT).json({message: "User does already exist !!!"});
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
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"});
        }
        if(user?.isVerified){
            res.status(StatusCodes.CONFLICT).json({message: "fail to activate or your account is already active"});
        }
        if(user && user.activeExpires !== null && user.activeExpires >= Date.now()){
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    isVerified: true
                }
            });
            res.status(StatusCodes.OK).json({message: "activation success!"});
        }
        res.status(StatusCodes.BAD_REQUEST).json({message: "Activation token has expired, request a new one!"});       
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export const requestActivationToken = async (req: Request, res: Response) => {
    try {
        const userId: string = req.body.id;
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if(user){
            setActivationToken(user.id);
            res.status(StatusCodes.OK).json({message: "The new activation code was sent to you e-mail"});
        }
        res.status(StatusCodes.NOT_FOUND).json({message: "User does not exist"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}
/*
export const requestPasswordReset = async (req: Request, res: Response)=>{
    try {
        const userEmail: string = req.body.email;
        const user = await prisma.user.findFirst({
            where: {
                email: userEmail
            }
        });
        if(user){
            const token: string = createRandomToken(user.id);
            const resetPasswordExpires: number = Date.now() + 24 * 3600* 1000;
            const link: string = `http://localhost:5000/signin/resetPassword/${token}`;
            await prisma.user.update({
                where: {
                    id: user.id
                },
                data: {
                    resetPasswordToken: token,
                    resetPasswordExpires: resetPasswordExpires
                }
            });
            mail.send({
                to: user.email,
                subject: "Password reset request",
                text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                    Please click on the  following link or paste it into your browser to continue the process:\n\n
                    ${link}\n\n
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
            });
            res.status(StatusCodes.OK);
        }
        res.status(StatusCodes.NOT_FOUND).json({message: "Email not registered in our system!!"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const checkResetPasswordToken = async (req: Request, res: Response) => {
    try {
        const token: string = req.body.token;
        const user = await prisma.user.findFirst({
            where: {
                resetPasswordToken: token
            }
        });
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json("User does not exist");
        };
        if(user && user.resetPasswordExpires !== null && user.resetPasswordExpires <= Date.now()){
            res.status(StatusCodes.OK);
        };
        res.status(StatusCodes.BAD_REQUEST).json("Token has expired, request a new one!");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
}

export const resetPassword = async(req: Request, res: Response)=>{
    try {
        const password: string = req.body.password;
        const email: string = req.body.email;
        const user = await prisma.user.findUniqueOrThrow({
            where: {
                email
            }
        });
        if(!user){
            res.status(StatusCodes.NOT_FOUND).json("User does not exist");
        }
        if(user && user.resetPasswordExpires !== null && user.resetPasswordExpires <= Date.now()){
            const passwordHashed: string = await bcrypt.hash(password, 8);
            await prisma.user.update({
                where: {
                    email
                },
                data: {
                    password: passwordHashed
                }
            });
            res.status(StatusCodes.OK).json("Password was succssefully changed");
        }
        res.status(StatusCodes.BAD_REQUEST).json("Link has expired, request a new one!");
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};
*/
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
            const {password, activeExpires, activeToken, isVerified, cpf, ...userInfos} = user;
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
            const {password, activeExpires, activeToken, isVerified, cpf, ...userInfos} = user;
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
        console.log('authId', authId);
        console.log('userInfos', userInfos);
        if(userInfos.id === authId){
            const user = await prisma.user.update({
                where: {
                    id: userInfos.id
                },
                data: userInfos
            });
            const {password, cpf, activeToken, activeExpires, ...userUpdatedInfos} = user;
            res.status(StatusCodes.OK).json({userUpdatedInfos});
        }else{
            res.status(StatusCodes.FORBIDDEN).json({message: "The given id is not the same as yours"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const editSensitiveData = async (req: Request, res: Response) => {

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

async function setActivationToken(userId: string){
    const activeToken: string = createRandomToken(userId); 
    const activeExpires: number = Date.now() + 24 * 3600* 1000;
    const link: string = `http://localhost:3000/api/v1/user/active/${activeToken}`;
    const user = await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            activeToken: activeToken,
            activeExpires: activeExpires
        }
    });
    mail.send({
        to: user.email,
        subject: "Welcome",
        html: `Please click <a href="${link}"> here </a> to activate your account.`
    });
};
