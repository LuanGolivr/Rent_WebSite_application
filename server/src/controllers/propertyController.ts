import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { prisma, requestQueue } from "../app.js";
import { cache } from "../app.js";
import { PropertyQueryBuilder } from "../utils/propertyQueryBuilder.js";


export const getSingleProperty = async (req: Request, res: Response)=> {
    /*
    #swagger.tags = ["Properties"]
    #swagger.summary = 'Returns a property by id'
    #swagger.description = 'This endpoint will get a specific property by its id...'
    #swagger.responses[200] = {
        schema: { $ref: '#/definitions/SingleProperty' }
    }
    */
    try {
        if(req.params.id){
            const id: string = req.params.id;
            const key = `property:${id}`;
            if(requestQueue.has(key)){
                const queue = requestQueue.get(key);
                queue!.push(res);
                requestQueue.set(key, queue!);
            }else{
                requestQueue.set(key, [res]);
                const queue = requestQueue.get(key);
                try{
                    let result: any;
                    if(await cache.keyExists(key)){
                        result = await cache.getData(key);
                    }else{
                        result = await prisma.property.findFirst({
                            where: {
                                id: id
                            },
                            include: {
                                imageVideo: true
                            }   
                        });
                        cache.setData(key, result);
                    };
                    for(const res of queue!){
                        res.status(StatusCodes.OK).json({data: result});
                    };
                }catch(error){
                    for(const res of queue!){
                        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
                    };
                }
                requestQueue.delete(key);
            }
        }else{
            res.status(StatusCodes.BAD_REQUEST).json({message: "Id was not provided"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const getProperties = async (req: Request, res: Response)=> {
    // #swagger.tags = ["Properties"]
    // #swagger.summary = 'Endpoint to get a list of properties'
    const params = req.query;
    const key: string = `properties:${JSON.stringify(params)}`;
    if(requestQueue.has(key)){
        const queue = requestQueue.get(key);
        queue!.push(res);
        requestQueue.set(key, queue!);
    }else{
        requestQueue.set(key, [res]);
        const queue = requestQueue.get(key);
        try{
            let result: any;
            const queryBuilder = new PropertyQueryBuilder(params);
            queryBuilder.buildQuery();
            const query = queryBuilder.getQuery();
            const skip: number = queryBuilder.getPage();
            const take: number = queryBuilder.getLimit();
            result = await prisma.property.findMany({
                where: query,
                include: {
                    imageVideo: true
                },
                skip: ((skip * 10) - 10),
                take: take,
            });
            for(const res of queue!){
                res.status(StatusCodes.OK).json({data: result});
            }
        }catch(error){
            for(const res of queue!){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
            }
        }
        requestQueue.delete(key);
    }
};

export const createProperty = async (req: Request, res: Response)=> {
    /*
        #swagger.tags = ["Properties"]
        #swagger.summary = 'Creates a new property'
        #swagger.description = 'This endpoint will create a new property...'
        #swagger.requestBody = {
            required: true,
            content: {
                "application/json": {
                    schema: {
                        $ref: "#/components/schemas/createPropertyBody"
                    }
                }
            }
        }
    */
    try {
        const propertyData = req.body;
        const user = await prisma.user.findFirstOrThrow({
            where: {
                id: propertyData.ownerId
            }
        });
        if(user.isAgent){
            const property = await prisma.property.create({
                data: propertyData,
            });
            res.status(StatusCodes.CREATED).json({property});
        }else{
            res.status(StatusCodes.FORBIDDEN).json({message: "You have to be an Agent to add a new property!"});
        }
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};

export const deleteProperty = async (req: Request, res: Response)=> {
    // #swagger.tags = ["Properties"]
    // #swagger.summary = 'Endpoint to delete an existed property'
    try {
        const id: string = req.body.id;
        const ownerId: string = req.body.ownerId;
        await prisma.property.delete({
            where: {
                id: id,
                ownerId: ownerId
            },
        });
        await cache.deleteData(`property:${id}`);
        res.status(StatusCodes.OK).json({message: 'Property was deleted successfully'});
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
};

export const updateProperty = async (req: Request, res: Response)=> {
    // #swagger.tags = ["Properties"]
    // #swagger.summary = 'Endpoint to update an existed property'
    try {
        if(req.body.id){
            const propertyId: string = req.body.id;
            const propertyData = req.body;
            const property =  await prisma.property.update({
                where: {
                    id: propertyId,
                    ownerId: propertyData.ownerId
                },
                data: propertyData,
                include: {
                    imageVideo: true
                }
            });
            res.status(StatusCodes.ACCEPTED).json({data: property});
        }else{
            res.json(StatusCodes.BAD_REQUEST).json({message: 'Invalid propertyId provided'});
        }       
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error});
    }
};



