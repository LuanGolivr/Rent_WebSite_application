import { Request, Response, text } from "express";

import { QueryBuilder } from "../utils/queryBuilder.js";
import { Query } from "../utils/types.js";
import { client } from "../database/dbConnection.js";



export const getSingleProperty = async (req: Request, res:Response)=>{
    try{
        const queryBuilder = new QueryBuilder(req.query);
        
        let query: Query = {
            text: 'SELECT * FROM properties WHERE ',
            values: [1]
        }


        queryBuilder.addWhereConditions(query.text);

        query.text = queryBuilder.query;
        query.values = queryBuilder.allValues;

        queryBuilder.cleanCounter();
        queryBuilder.cleanQuery();

        console.log(query);

        const data = (await client.query(query)).rows;
        
        res.status(200).json({response: data}).end();
    }catch(error){
        res.status(500).json(error);
    }finally{

    }
};

export const getProperties = async(req: Request, res: Response) =>{
    try{

    }catch(error){

    }finally{
        
    }
}

export const getRecentProperties = async (req: Request, res: Response)=>{
    try{

    }catch(error){

    }finally{
        
    }
}

export const getExpensiveProperties = async (req: Request, res: Response)=>{
    try{

    }catch(error){

    }finally{
        
    }
}

export const getCheapProperties = async (req: Request, res: Response)=>{
    try{

    }catch(error){

    }finally{
        
    }
}

export const getFavoritesProperties = async (req: Request, res: Response)=>{
    try{

    }catch(error){

    }finally{
        
    }
}