import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { prisma } from "../app";

export const uploadImageOrVideo = async (req: Request, res: Response)=> {
    try{
        const uploadedFiles = req.files;
        const userId: string = req.body.userId;
        const propertyId: string = req.body.propertyId;
        
        const property = await prisma.property.findFirst({
            where: {
                ownerId: userId,
                id: propertyId
            },
        });
        
        if(property && Array.isArray(uploadedFiles)){
            uploadedFiles.forEach(async (item) => {
                await prisma.imageVideo.create({
                    data: {
                        propertyId: propertyId,
                        originalName: item.originalname,
                        mimeType: item.mimetype,
                        size: item.size,
                        url: item.path
                    }
                });
            });

            res.status(StatusCodes.CREATED).json({message: 'The files were added successfully'});
        }else{
            res.status(StatusCodes.NOT_FOUND).json({message: "It wasn't possible to find a property with the given parameters"});
        }

        
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

export const deleteImageOrVideo = async (req: Request, res: Response)=> {
    try{
        
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};