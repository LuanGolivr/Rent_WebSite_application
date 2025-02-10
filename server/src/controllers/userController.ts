import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { prisma } from "../app";

dotenv.config();

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

            await prisma.user.create({
                data: newUserInfos
            });

            res.status(StatusCodes.CREATED).json({message: "User created successfully !!"});
        }else{
            res.status(StatusCodes.CONFLICT).json({message: "User does already exist !!!"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const login = async (req: Request, res: Response)=>{
    try {
        const formInfos = req.body;

        const user = await prisma.user.findUnique({
            where: {
                email: formInfos.email,
            }
        });

        if(!user){
            res.status(StatusCodes.NOT_FOUND).json({message: 'User not found or email is incorrect'});
        }

        const passwordIsValid = await bcrypt.compare(formInfos.password, user!.password);

        if(!passwordIsValid){
            res.status(StatusCodes.UNAUTHORIZED).json({message: "Password is wrong"});
        }

        const id: string = user!.id.toString();
        const secretKey: string = process.env.JWT_SECRET as string;
        const token = jwt.sign({id}, secretKey, { expiresIn: "1d" });
        
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.HTTPS_ONLY_SECURE === "production" ? true : false,
            sameSite: 'strict',
            path: '/',
            maxAge: 86400000
        });
        
        res.status(StatusCodes.OK).json({user});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie('jwt');
        res.status(StatusCodes.OK).json({success: true});
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