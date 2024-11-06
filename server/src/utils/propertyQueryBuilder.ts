import {} from 'express';

export class PropertyQueryBuilder{
    private query: any;
    private params: any

    constructor(params: any){
        this.params = params;
        this.query = {};
        this.buildQuery();
    };

    private buildQuery(){
        Object.keys(this.params).map((key) => {
            if(key === "rooms" || key === "suites" || key === "bathrooms" || key === "parkingSpace"){
                this.query[key] = {
                    gte: parseInt(this.params[key])
                }
            }else if(key === "area" || key === "condominiumPrice" || key === "price"){
                this.query[key] = {
                    gte: parseFloat(this.params[key].min),
                    lte: parseFloat(this.params[key].max)
                }
            }else{
                this.query[key] = this.params[key];
            }
        });
    }

    getQuery(){
        return this.query;
    }

}