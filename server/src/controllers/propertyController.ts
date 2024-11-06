import { Request, Response } from "express";
import { prisma, requestQueue } from "../app.js";
import { PropertyQueryBuilder } from "../utils/propertyQueryBuilder.js";


export const getSingleProperty = async (req: Request, res: Response)=> {
    // #swagger.tags = ['Properties']
    // #swagger.summary = 'Some summary...'
    // #swagger.description = 'Some description...'
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
                const data = false//(await client).hGetAll(key);
                if(data){
                    result = data;
                }else{
                    result = await prisma.property.findFirst({
                        where: {
                            id: parseInt(id)
                        },
                        include: {
                            imageVideo: true
                        }   
                    });

                    //(await client).set(key, result);
                }

                for(const res of queue!){
                    res.status(200).json({data: result});
                }
            }catch(error){
                for(const res of queue!){
                    res.status(500).json({error});
                }
            }
            
            requestQueue.delete(key);
        }
    }else{
        res.status(400).json({message: "Invalid id provided"});
    }
};

export const getProperties = async (req: Request, res: Response)=> {
    // #swagger.tags = ['Properties']
    const params = req.query;
    const key = `properties:${JSON.stringify(params)}`;

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
            const query = queryBuilder.getQuery();

            result = await prisma.property.findMany({
                where: query,
                include: {
                    imageVideo: true
                },
                take: 20,
            });

            for(const res of queue!){
                res.status(200).json({data: result});
            }

        }catch(error){
            for(const res of queue!){
                res.status(500).json({error});
            }
        }

        requestQueue.delete(key);
    }
};

export const createProperty = async (req: Request, res: Response)=> {

};

export const createManyProperties = async (req: Request, res: Response)=> {

};

export const deleteProperty = async (req: Request, res: Response)=> {

};

export const deleteManyProperties = async (req: Request, res: Response)=> {

};

export const editProperty = async (req: Request, res: Response)=> {

};

export const editManyProperties = async (req: Request, res: Response)=> {

};



