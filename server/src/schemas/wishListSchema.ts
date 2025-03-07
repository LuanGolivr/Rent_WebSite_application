import z from 'zod';

export const addOrDeletePropertyToWishListSchema = z.object({
    body: z.object({
        userId: z.string({
            required_error: "UserId is required",
            invalid_type_error: "UserId must be a string"
        }).uuid({
            message: "UserId must be a valid uuid"
        }),

        propertyId: z.string({
            required_error: "Property Id is required",
            invalid_type_error: "Property Id must be a string"
        }).uuid({
            message: "Property Id must be a valid uuid"
        }),
    })
});