import { booleanAttributesFields, integerAttributesFields, rangeFloatAttributesFields } from "../const";

export class PropertyQueryBuilder{
    private _page: number = 1;
    private _limit: number = 10;
    private query: any = {};
    private params: any;

    constructor(params: any){
        const {page, limit, ...parameters} = params;
        this.params = parameters;
        this.setPage(page);
        this.setLimit(limit);
    };

    buildQuery(){
        this.castBooleanFields();
        this.castIntegerFields();
        this.castRangeFloatFields();

        Object.keys(this.params).map((key) => {
            if(integerAttributesFields.has(key)){
                this.query[key] = {
                    equals: this.params[key]
                }
            }else if(rangeFloatAttributesFields.has(key)){
                this.query[key] = {
                    gte: this.params[key].min,
                    lte: this.params[key].max
                }
            }else{
                this.query[key] = this.params[key];
            }
        });
    }

    castBooleanFields(): void {
        Object.keys(this.params).map((key) => {
            if(booleanAttributesFields.has(key)){
                const value = this.params[key];
                this.params[key] = (value === "true") ? true : false;
            }
        });
    }

    castIntegerFields(): void {
        Object.keys(this.params).map((key) => {
            if(integerAttributesFields.has(key)){
                this.params[key] = parseInt(this.params[key])
            }
        })
    }

    castRangeFloatFields(): void {
        Object.keys(this.params).map((key) => {
            if(rangeFloatAttributesFields.has(key)){
                this.params[key].min = parseFloat(this.params[key].min);
                this.params[key].max = parseFloat(this.params[key].max);
            }
        })
    }

    getPage(): number{
        return this._page;
    }

    private setPage(value: any){
        this._page = (value !== undefined) ? parseInt(value) : this._page;
    }

    getLimit(): number{
        return this._limit;
    }

    private setLimit(value: any ){
        this._limit = (value || value !== undefined) ? parseInt(value) : this._limit;
    }

    getQuery(){
        return this.query;
    }
}