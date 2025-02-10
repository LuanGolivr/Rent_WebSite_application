import z from 'zod';

export const registerUserSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        }).email({
            message: "Email provided must be a valid one"
        }),

        password: z.string({
            required_error: "Password is required",
            invalid_type_error: "Password must be a string"
        }),

        firstName: z.string({
            required_error: "First name is required",
            invalid_type_error: "First name  must be a string"
        }).max(20, {
            message: "Your first name can not be larger than 20 characters"
        }),

        surname: z.string({
            required_error: "Surname is required",
            invalid_type_error: "Surname must be a string"
        }).max(20, {
            message: "Your surname can not be larger than 20 characters"
        }),
        cpf: z.string({
            required_error: "CPF is required",
            invalid_type_error: "CPF must be a string"
        }).max(14, {
            message: "Your CPF can not be larger than 14 characters ie: 000.000.000-00"
        }),
        
        phoneNumber: z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }),
    })
});

export const loginUserSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is required"
        }).email({
            message: "The email must be a valid one"
        }),

        password: z.string({
            required_error: "Password is required"
        })
    })
});