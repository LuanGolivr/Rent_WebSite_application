import { ManyPosts, Query } from "./types.js";

export const extractManyValues = (data: ManyPosts)=>{
    const values: string[] = [];
    const placeholders = data.data.map((post, i) =>{
        const idx = i * 2;
        values.push(post.title, post.text);
        return `($${idx + 1}, $${idx + 2})`;
    }).join(', ');

    let infos = {
        placeholders,
        values
    }

    return infos;
}