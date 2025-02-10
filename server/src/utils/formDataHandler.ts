import { booleanAttributesFields, integerAttributesFields, rangeFloatAttributesFields } from "../const";

export class FormDataHandler {
    private formData: any

    constructor(formData = {}){
        this.formData = formData;
    }

    build(){
        this.castBooleanAttributes();
        this.castIntegerAttributes();
        this.castFloatAttributes();
    }

    private castBooleanAttributes(){
        Object.keys(this.formData).map((key) => {
            if(booleanAttributesFields.has(key)){
                const value = this.formData[key];
                this.formData[key] = value === "true" ? true : false;
            }
        })
    }

    private castIntegerAttributes(){
        Object.keys(this.formData).map((key) => {
            if(integerAttributesFields.has(key)){
                this.formData[key] = parseInt(this.formData[key]);
            }
        });
    }

    private castFloatAttributes(){
        Object.keys(this.formData).map((key) => {
            if(rangeFloatAttributesFields.has(key)){
                this.formData[key] = parseFloat(this.formData[key]);
            }
        })
    }

    getformData(){
        return this.formData;
    }
}