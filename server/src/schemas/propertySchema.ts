import z from 'zod';


export const createPropertySchema = z.object({
    body: z.object({
        available: z.boolean({
            invalid_type_error: "the parameter available must be a boolean"
        }).optional(),

        sellOrRent: z.enum(["sell", "rent"], {
            invalid_type_error: "It must be 'sell' or 'rent'"
        }),

        propertyType: z.enum(["house", "apartment"], {
            invalid_type_error: "it must be 'house' or 'apartment'"
        }),

        title: z.string({
            required_error: "A title must be given",
            invalid_type_error: "The parameter title must be a string"
        }).max(50).toLowerCase(),

        description: z.string({
            invalid_type_error: "The parameter descripton must be a string"
        }).max(500).toLowerCase().optional(),

        street: z.string({
            invalid_type_error: "the parameter street must be a string"
        }).max(100),

        neighborhood: z.string({
            invalid_type_error: "the parameter neighborhood must be a string"
        }).max(100),

        city: z.string({
            invalid_type_error: "the parameter city must be a string"
        }).max(100),

        state: z.string({
            invalid_type_error: "the parameter state must be a string"
        }).max(100),

        furnished: z.boolean({
            invalid_type_error: "the parameter furnished must be a boolean."
        }).optional(),

        rooms: z.number({
            invalid_type_error: "the parameter rooms must be a number",
            required_error: "The parameter rooms is required"
        }).int({
            message: "The number must be a integer"
        }),

        suites: z.number({
            invalid_type_error: "the parameter suites must be a number"
        }).int({
            message: "The number must be a integer"
        }),

        bathrooms: z.number({
            invalid_type_error: "the parameter bathrooms must be a number"
        }).int({
            message: "The number must be a integer"
        }),

        parkingSpace: z.number({
            invalid_type_error: "the parameter parkingSpace must be a number"
        }).optional(),

        area: z.number({
            invalid_type_error: "The parameter area must be a number",
            required_error: "The parameter area must be given"
        }).min(0),

        condominiumPrice: z.number({
            invalid_type_error: "The parameter condominiumPrice must be a number"
        }).optional(),

        price: z.number({
            required_error: "The parameter price must be given",
            invalid_type_error: "The parameter price must be a number"
        }).min(0),

        playground: z.boolean({
            invalid_type_error: "the parameter playground must be a boolean'"
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

        ownerId: z.string({
            invalid_type_error: "The parameter ownerId must be a string",
            required_error: "The parameter ownerId is required"
        }).uuid({
            message: "The parameter ownerId must be a valid uuid"
        })
    })
});

export const updatePropertySchema = z.object({
    body: z.object({
        available: z.boolean({
            invalid_type_error: "the parameter available must be a boolean"
        }).optional(),

        sellOrRent: z.enum(["sell", "rent"], {
            invalid_type_error: "It must be 'sell' or 'rent'"
        }).optional(),

        propertyType: z.enum(["house", "apartment"], {
            invalid_type_error: "it must be 'house' or 'apartment'"
        }).optional(),

        title: z.string({
            required_error: "A title must be given",
            invalid_type_error: "The parameter title must be a string"
        }).max(50).toLowerCase().optional(),

        description: z.string({
            invalid_type_error: "The parameter descripton must be a string"
        }).max(500).toLowerCase().optional(),

        street: z.string({
            invalid_type_error: "the parameter street must be a string"
        }).max(100).optional(),

        neighborhood: z.string({
            invalid_type_error: "the parameter neighborhood must be a string"
        }).max(100).optional(),

        city: z.string({
            invalid_type_error: "the parameter city must be a string"
        }).max(100).optional(),

        state: z.string({
            invalid_type_error: "the parameter state must be a string"
        }).max(100).optional(),

        furnished: z.boolean({
            invalid_type_error: "the parameter furnished must be a boolean."
        }).optional(),

        rooms: z.number({
            invalid_type_error: "the parameter rooms must be a number",
            required_error: "The parameter rooms is required"
        }).int({
            message: "The number must be a integer"
        }).optional(),

        suites: z.number({
            invalid_type_error: "the parameter suites must be a number"
        }).int({
            message: "The number must be a integer"
        }).optional(),

        bathrooms: z.number({
            invalid_type_error: "the parameter bathrooms must be a number"
        }).int({
            message: "The number must be a integer"
        }).optional(),

        parkingSpace: z.number({
            invalid_type_error: "the parameter parkingSpace must be a number"
        }).optional(),

        area: z.number({
            invalid_type_error: "The parameter area must be a number",
            required_error: "The parameter area must be given"
        }).min(0).optional(),

        condominiumPrice: z.number({
            invalid_type_error: "The parameter condominiumPrice must be a number"
        }).optional(),

        price: z.number({
            required_error: "The parameter price must be given",
            invalid_type_error: "The parameter price must be a number"
        }).min(0).optional(),

        playground: z.boolean({
            invalid_type_error: "the parameter playground must be a boolean'"
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

        ownerId: z.string({
            invalid_type_error: "The parameter ownerId must be a string",
            required_error: "The parameter ownerId is required"
        }).uuid({
            message: "The parameter ownerId must be a valid uuid"
        })
    })
});

export const deletePropertySchema = z.object({
    body: z.object({
        id: z.string({
            invalid_type_error: "Id must be a string",
            required_error: "An id must be provided"
        }).uuid({
            message: "The id must be a valid uuid"
        }),
        ownerId: z.string({
            invalid_type_error: "The ownerId must be a string",
            required_error: "An ownerId must be provided"
        }).uuid({
            message: "The ownerId must be a valid uuid"
        })
    }),
});