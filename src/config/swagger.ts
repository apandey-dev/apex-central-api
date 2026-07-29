import path from 'path';
import swaggerJsdoc from 'swagger-jsdoc';

const routesGlob = [
  path.join(process.cwd(), 'src', 'routes', '*.ts'),
  path.join(process.cwd(), 'dist', 'routes', '*.js'),
  path.join(__dirname, '..', 'routes', '*.js'),
  path.join(__dirname, '..', 'routes', '*.ts'),
  './src/routes/*.ts',
  './dist/routes/*.js',
];

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Apex Central API',
      version: '1.0.0',
      description:
        'High-performance, modular backend API service for Authentication, Profile & PFP Management, Tasks, Product Catalog, User Messages, Key-Value Settings, and System Logging.',
      contact: {
        name: 'Apex API Support',
      },
    },
    servers: [
      {
        url: 'https://api.apandey.me',
        description: 'Production Server (api.apandey.me)',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: routesGlob,
};

export const swaggerSpec = swaggerJsdoc(options);
