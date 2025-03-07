import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { prisma } from "../app";

export const uploadImageOrVideo = async (req: Request, res: Response)=> {
    try{
        const uploadedFiles = req.files;
        const userId: string = req.body.userId;
        const propertyId: string = req.body.propertyId;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: userId
            }
        });

        if(user.isAgent){
            await prisma.property.findUniqueOrThrow({
                where: {
                    ownerId: userId,
                    id: propertyId
                },
            });
            if(Array.isArray(uploadedFiles)){
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
            } 
        }else{
            res.status(StatusCodes.FORBIDDEN).json({message: "You must be an Agent to upload a file!"});
        }     
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

export const deleteImageOrVideo = async (req: Request, res: Response)=> {
    try{
        const fileId: string = req.body.id;
        const propertyId: string = req.body.propertyId;
        await prisma.imageVideo.delete({
            where: {
                id: fileId,
                propertyId: propertyId
            }
        });
        res.status(StatusCodes.OK).json({message: "File deleted successfully!"});
    }catch(error){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};