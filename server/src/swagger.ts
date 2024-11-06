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
    ]
};

const outputFile = './swagger_output.json';
const endpointsFiles = ["./routes/*.ts"];

swaggerAutogen({openapi: "3.0.0"})(outputFile, endpointsFiles, doc);