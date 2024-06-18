import { Request, Response } from "express";
import { client } from "../database/dbConnection.js";
import { DeletePost, ManyPosts, Query } from "../utils/types.js";
import { extractManyValues } from "../utils/queryBuilder.js";


export const getSinglePost = async (req: Request, res: Response)=>{
    try{
        if(req.params.id){
            const id = req.params.id;
            
            const query: Query = {
                text: "SELECT * FROM posts WHERE id = $1",
                values: [id]
            }

            const response = await client.query(query);
            res.status(200).json({data: response.rows[0]}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const getManyPosts = async (req: Request, res:Response)=>{
    try{
        if(req.query.offset){
            let offset = req.query.offset;

            const query: Query = {
                text: 'SELECT * FROM posts ORDER BY updated_at DESC LIMIT 20 OFFSET $1',
                values: [offset]
            };

            const response = await client.query(query);
            res.status(200).json({data: response.rows}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const insertSinglePost = async (req: Request, res:Response)=>{
    try{
        if(req.body.text && req.body.title){
            
            const title: string = req.body.title;
            const text: string = req.body.text;

            const query: Query = {
                text: "INSERT INTO posts(title, post_text) VALUES($1, $2)",
                values: [title, text]
            };

            const response = await client.query(query);
            res.status(200).json({data: response}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const insertManyPost = async (req: Request, res:Response)=>{
    try{
        if(req.body.data){
            const data: ManyPosts = req.body;
            const infos = extractManyValues(data);

            const query: Query = {
                text: `INSERT INTO posts(title, post_text) VALUES ${infos.placeholders}`,
                values: infos.values
            };
            console.log(query);
            const response = await client.query(query);
            res.status(200).json({data: response}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const updateSinglePost = async (req: Request, res:Response)=>{
    try{
        if(req.body.id){
            const id = req.body.id;
            let query: Query = {
                text: "",
                values: []
            }

            if(req.body.title && req.body.text){
                const title: string = req.body.title;
                const text: string = req.body.text;

                query.text = 'UPDATE posts SET title = $2, post_text = $3, updated_at = NOW() WHERE id = $1';
                query.values.push(id);
                query.values.push(title);
                query.values.push(text);

            }else if(req.body.title){
                const title: string = req.body.title;

                query.text = "UPDATE posts SET title = $2, updated_at = NOW() WHERE id = $1";
                query.values.push(id);
                query.values.push(title);
            }else{
                const text: string = req.body.text;

                query.text = "UPDATE posts SET post_text = $2, updated_at = NOW() WHERE id = $1";
                query.values.push(id);
                query.values.push(text);
            }

            const response = await client.query(query);
            res.status(200).json({data: response}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const deleteSinglePost =  async (req: Request, res:Response)=>{
    try{
        if(req.body.id){
            const id = req.body.id;

            const query: Query = {
                text: 'DELETE FROM posts WHERE id = $1',
                values: [id]
            }

            await client.query(query);
            res.status(200).json({response: 'The post was successfully deleted !!!'}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const deleteManyPosts =  async (req: Request, res:Response)=>{
    try{
        if(req.body.data){
            const data: DeletePost = req.body;
            for(const item of data.data){
                const query: Query = {
                    text: 'DELETE FROM posts WHERE id = $1',
                    values: [item]
                }

                console.log(query);

                await client.query(query);
            }

            res.status(200).json({response: 'All the posts where deleted successfully !!!'}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const feedDatabase =  async (req: Request, res:Response)=>{
    try{

    }catch(error){
        res.status(500).json({error: error}).end();
    }
};