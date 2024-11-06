import z from 'zod';

export const getsinglePropertySchema = z.object({
    params: z.object({
        id: z.string({
            required_error: "property Id is required",
            invalid_type_error: "Id must be a string",

        })
    }),
});

export const getManyPropertiesSchema = z.object({
    query: z.object({
        sellOrRent: z.enum(["sell", "rent"], {
            invalid_type_error: "It must be 'sell' or 'rent'"
        }).optional(),

        propertyType: z.enum(["house", "apartment"], {
            invalid_type_error: "it must be 'house' or 'apartment'"
        }).optional(),

        street: z.string({
            invalid_type_error: "the parameter street must be a string"
        }).optional(),

        neighborhood: z.string({
            invalid_type_error: "the parameter neighborhood must be a string"
        }).optional(),

        city: z.string({
            invalid_type_error: "the parameter city must be a string"
        }).optional(),

        state: z.string({
            invalid_type_error: "the parameter state must be a string"
        }).optional(),

        furnished: z.boolean({
            invalid_type_error: "the parameter furnished must be a boolean"
        }).optional(),

        rooms: z.number({
            invalid_type_error: "the parameter rooms must be a integer"
        }).int().min(0).optional(),

        suites: z.number({
            invalid_type_error: "the parameter suites must be a integer"
        }).int().min(0).optional(),

        bathrooms: z.number({
            invalid_type_error: "the parameter bathrooms must be a integer"
        }).int().min(0).optional(),

        parkingSpace: z.number({
            invalid_type_error: "the parameter parkingSpace must be a integer"
        }).int().min(0).optional(),

        area: z.object({
            min: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
            max: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
        }).optional(),

        condominiumPrice: z.object({
            min: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
            max: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
        }).optional(),

        price: z.object({
            min: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
            max: z.number({
                invalid_type_error: "the parameter must be a number"
            }).min(0),
        }).optional(),

        playground: z.boolean({
            invalid_type_error: "the parameter playground must be a boolean"
        }).optional(),

        gym: z.boolean({
            invalid_type_error: "the parameter gym must be a boolean"
        }).optional(),

        gourmetArea: z.boolean({
            invalid_type_error: "the parameter gourmetArea must be a boolean"
        }).optional(),

        sportCourt: z.boolean({
            invalid_type_error: "the parameter sportCourt must be a boolean"
        }).optional(),

        pool: z.boolean({
            invalid_type_error: "the parameter pool must be a boolean"
        }).optional(),

        warmPool: z.boolean({
            invalid_type_error: "the parameter warmPool must be a boolean"
        }).optional(),

        greenArea: z.boolean({
            invalid_type_error: "the parameter greenArea must be a boolean"
        }).optional(),

        skip: z.number({
            invalid_type_error: "the parameter skip must be a number",
            required_error: "the parameter skip is required"
        }).int()
    }),
});