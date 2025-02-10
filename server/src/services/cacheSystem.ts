import NodeCache from "node-cache";

export class CacheSystem {
    private cache = new NodeCache({
        stdTTL: 3600,
        checkperiod: 3600, 
    });

    async keyExists(key: string): Promise<boolean>{
        return this.cache.has(key);
    }

    async getData(key: string): Promise<any>{
        return this.cache.get(key)
    }

    async setData(key: string, value: any, lifeTime: number = 3600): Promise<void>{
       this.cache.set(key, value, lifeTime);
    }

    async deleteData(key: string): Promise<void>{
        this.cache.del(key);
    }
}