import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
    user: process.env.POSTGRES_USER ,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    port: Number((process.env.POSTGRES_PORT)),
    host: process.env.POSTGRES_HOST
});

export const connectToDatabase = async (timeoutMs: number = 5000)=>{
    const timeoutPromise = new Promise<never>((_, reject) =>{
        setTimeout(()=> reject(new Error('Connection timed out')), timeoutMs);
    });

    try{
        await Promise.race([client.connect(), timeoutPromise]);
        console.log('Successfully connected to database');
    }catch(error){
        if(error instanceof Error){
            console.error(error.message);
        }else{
            console.error('Unknown Error ', error);
        }
        return error;
    }
}