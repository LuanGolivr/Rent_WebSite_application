import swaggerAutogen from 'swagger-autogen';

const doc = {
    info:{
        version: "v1.0.0",
        title: "Rent app project",
        description: "A website to rent appartments and houses"
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
    basePath: "http://localhost:3000",
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            }
        }
    },
    tags: [
        {
            "name": "Properties",
        }
    ],
    definitions: {
        SingleProperty: {
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
            greenArea: true,
        },
        ManyProperties: [
            
        ]
    }
};

const outputFile = './swagger_output.json';
const endpointsFiles = ["./routes/*.ts"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);