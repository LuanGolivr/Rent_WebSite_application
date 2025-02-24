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

export const requestPasswordResetSchema = z.object({
    body: z.object({
            email: z.string({
                required_error: 'Rmail is required to request the reset of the password',
                invalid_type_error: "The email must be a string"
            }).email({
                message: "The email provided must be a valid one"
            })
    })
});

export const resetPasswordSchema = z.object({
    body:  z.object({
        password: z.string({
            invalid_type_error: 'The new password must be a string',
            required_error: "Password is required"
        })
    })
});

export const updateNonSensitiveDataSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: "The id is required to perform this operation",
            invalid_type_error: "Ther id must be a string"
        }).uuid({
            message: "The id must be a valid uuid"
        }),

        email: z.string({
            required_error: "Email is required",
            invalid_type_error: "Email must be a string"
        }).email({
            message: "Email provided must be a valid one"
        }).optional(),

        firstName: z.string({
            required_error: "First name is required",
            invalid_type_error: "First name  must be a string"
        }).max(20, {
            message: "Your first name can not be larger than 20 characters"
        }).optional(),

        surname: z.string({
            required_error: "Surname is required",
            invalid_type_error: "Surname must be a string"
        }).max(20, {
            message: "Your surname can not be larger than 20 characters"
        }).optional(),
        
        phoneNumber: z.string({
            required_error: "Phone number is required",
            invalid_type_error: "Phone number must be a string"
        }).optional(),
    })
});

export const deleteAccountSchema = z.object({
    body: z.object({
        id: z.string({
            required_error: "The id is required to perform this operation",
            invalid_type_error: "Ther id must be a string"
        }).uuid({
            message: "The id must be a valid uuid"
        })
    })
})