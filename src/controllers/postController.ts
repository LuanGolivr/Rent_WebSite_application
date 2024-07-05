import { Request, Response } from "express";
import { LRUCache } from "lru-cache";
import { client } from "../database/dbConnection.js";
import { DeletePost, ManyPosts, Query } from "../utils/types.js";
import { extractManyValues } from "../utils/queryBuilder.js";

const cache = new LRUCache<string, any>({
    max: 150,
    ttl: 1000 * 60 * 5,
    updateAgeOnGet: true,
});

const batching: Map<string, any[]> = new Map<string, any[]>();

export const getSinglePost = async (req: Request, res: Response)=>{
    if(req.params.id){
        const id = req.params.id;

        if(batching.has(id)){
            const queue = batching.get(id);
            queue!.push(res);
            batching.set(id, queue!);
        }else{
            batching.set(id, [res]);
            const queue = batching.get(id);
            try{
                let result: any;
                
                if(cache.has(id)){
                    result = cache.get(id);
                }else{
                    const query: Query = {
                        text: "SELECT * FROM posts WHERE id = $1",
                        values: [id]
                    }
        
                    result = (await client.query(query)).rows[0];
                    cache.set(id, result);
                }

                for(const res of queue!){
                    res.status(200).json({data: result}).end();
                }

                batching.delete(id);
            }catch(error){
                for(const res of queue!){
                    res.status(500).json({error: error}).end();
                }

                batching.delete(id);
            }
        }
    }else{
        res.status(500).json({error: 'Invalid id was provided'}).end();
    }
};

export const getManyPosts = async (req: Request, res:Response)=>{
    if(req.query.offset){
        const offset = req.query.offset;
        const keyOffset: string = `offset_${offset}`;

        if(batching.has(keyOffset)){
            const queue = batching.get(keyOffset);
            queue!.push(res);
            batching.set(keyOffset, queue!);
        }else{
            batching.set(keyOffset, [res]);
            const queue = batching.get(keyOffset);

            try{
                let result: any;

                if(cache.has(keyOffset)){
                    result = cache.get(keyOffset);
                }else{
                    const query: Query = {
                        text: 'SELECT * FROM posts ORDER BY updated_at DESC LIMIT 20 OFFSET $1',
                        values: [offset]
                    };
                    result = (await client.query(query)).rows;
                    cache.set(keyOffset, result);
                }

                for(const res of queue!){
                    res.status(200).json({data: result}).end();
                }

                batching.delete(keyOffset);
            }catch(error){
                for(const res of queue!){
                    res.status(500).json({error: error}).end();
                }

                batching.delete(keyOffset);
            }
        }
    }else{
        res.status(500).json({error: 'Invalid parameter was provided'}).end();
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
            cache.delete(id);
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
            cache.delete(id);
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

            for(const item of data.data){
                cache.delete(item.toString());
            }

            res.status(200).json({response: 'All the posts where deleted successfully !!!'}).end();
        }
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};

export const feedDatabase =  async (req: Request, res:Response)=>{
    try{
        const title: string = "Lorem ipsum dolor sit amet";
        const text: string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

        for(let i = 0; i < 100; i++){
            const query: Query = {
                text: 'INSERT INTO posts(title, post_text) VALUES ($1, $2)',
                values: [title, text]
            };
            await client.query(query);
            console.log(i);
        }
        
        res.status(200).json({response: 'All the 100 records were stored in the database'});
    }catch(error){
        res.status(500).json({error: error}).end();
    }
};