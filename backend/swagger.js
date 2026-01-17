import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Ignite API',
    description: 'Backend API for the Ignite MERN Project',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
    console.log("✔ Swagger output file generated");
});