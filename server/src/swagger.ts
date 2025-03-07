import swaggerAutogen from 'swagger-autogen';

interface SwaggerAutogenOptions {
    openapi: string;
}

const swaggerAutogenTyped = (options: SwaggerAutogenOptions) => swaggerAutogen(options);
const swaggerAutogenInstance = swaggerAutogenTyped({ openapi: '3.0.0' });
export default swaggerAutogenInstance;

const doc = {
    info: {
        version: "v1.0.0",
        title: "Rent app project",
        description: "A website to rent appartments and houses",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
    basePath: "http://localhost:3000",
    components: {
        schemas: {
            createPropertyBody: {
                type: "object",
                properties: {
                    id: 0,
                    available: true,
                    sellOrRent: "sell",
                    propertyType: "house",
                    title: "string",
                    description: "string",
                    street: "string",
                    neighborhood: "string",
                    city: "string",
                    state: "string",
                    furnished: true,
                    rooms: 0,
                    suites: 0,
                    bathrooms: 0,
                    parkingSpace: 0,
                    area: 100.50,
                    condominiumPrice: 100.50,
                    price: 100.50,
                    playground: true,
                    gym: true,
                    gourmetArea: true,
                    sportCourt: true,
                    pool: true,
                    warmPool: true,
                    greenArea: true
                },
                required: ["available", "sellOrRent", "propertyType", "title", "description", "street", "neighborhood", "city", "state", "furnished", "rooms", "suites", "bathrooms", "parkingSpace", "area", "price", "ownerId"]
            },
            SingleProperty: {
                type: "object",
                properties: {
                    id: { type: "integer", example: 0 },
                    available: { type: "boolean", example: true },
                    sellOrRent: { type: "string", example: "sell" },
                    propertyType: { type: "string", example: "house" },
                    title: { type: "string", example: "string" },
                    description: { type: "string", example: "string" },
                    street: { type: "string", example: "string" },
                    neighborhood: { type: "string", example: "string" },
                    city: { type: "string", example: "string" },
                    state: { type: "string", example: "string" },
                    furnished: { type: "boolean", example: true },
                    rooms: { type: "integer", example: 0 },
                    suites: { type: "integer", example: 0 },
                    bathrooms: { type: "integer", example: 0 },
                    parkingSpace: { type: "integer", example: 0 },
                    area: { type: "number", example: 100.50 },
                    condominiumPrice: { type: "number", example: 100.50 },
                    price: { type: "number", example: 100.50 },
                    playground: { type: "boolean", example: true },
                    gym: { type: "boolean", example: true },
                    gourmetArea: { type: "boolean", example: true },
                    sportCourt: { type: "boolean", example: true },
                    pool: { type: "boolean", example: true },
                    warmPool: { type: "boolean", example: true },
                    greenArea: { type: "boolean", example: true },
                }
            },
            ManyProperties: {
                type: "array",
                items: {
                    $ref: "#/components/schemas/SingleProperty",
                },
            },
        },
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
    tags: [
        {
            name: "Properties",
        },
    ],
};

const outputFile = './swagger_output.json';
const endpointsFiles = ["./routes/*.ts"];

swaggerAutogenInstance(outputFile, endpointsFiles, doc);