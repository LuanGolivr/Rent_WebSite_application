import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../app";


export const addPropertyToWishList = async (req: Request, res: Response)=>{
    try {
        const userId: string = req.body.userId;
        const propertyId: string = req.body.propertyId;
        const wishList = await prisma.wishList.findUnique({
            where: {
                userId: userId
            }
        });
        if(!wishList){
            await prisma.wishList.create({
                data: {
                    userId
                }
            })
        }
        await prisma.wishList.update({
            where: {
                userId: userId
            },
            data: {
                properties: {
                    connect: {
                        id: propertyId
                    }
                }
            }
        });
        res.status(StatusCodes.OK).json({message: "Property was included in your wishlist successfully!!"});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export const getWishList = async (req: Request, res: Response)=>{
    try {
        const userId = req.userId;
        const wishList = await prisma.wishList.findMany({
            where: {
                userId: userId
            },
            include: {
                properties: true
            }
        });
        res.status(StatusCodes.OK).json(wishList);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

export const deletePropertyFromWishList = async (req: Request, res: Response)=>{
    try {
        const userId = req.body.userId;
        const propertyId = req.body.propertyId;
        const wishList = await prisma.wishList.update({
            where: {
                userId,
            },
            data: {
                properties: {
                    disconnect: {
                        id: propertyId
                    }
                }
            },
            include: {
                properties: true
            }
        });
        res.status(StatusCodes.NO_CONTENT).json(wishList);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}