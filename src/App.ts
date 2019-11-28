import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import mongoose from 'mongoose';

import APIRoutes from '@routes/Routes';
import CommonSchemaTags from '@schemas/common/tags';

class App {
  public fastifyApp: fastify.FastifyInstance;
  public apiRoutes: APIRoutes;

  constructor() {
    this.fastifyApp = fastify({
      logger: { prettyPrint: true }
    });
    this.apiRoutes = new APIRoutes(this.fastifyApp);

    this.connectToDatabase();
    this.configPreRouteMiddlewares();
    this.setUpSwagger();
    this.setUpAPIRoutes();
    this.configPostRouteMiddlewares();
  }

  private configPreRouteMiddlewares(): void {

  }

  private configPostRouteMiddlewares(): void {

  }

  private async connectToDatabase(): Promise<any> {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/rtms';

    try {
      this.fastifyApp.log.info('Connecting to MongoDB...');
      await mongoose.connect(mongoURI, { useUnifiedTopology: true, useNewUrlParser: true });
      this.fastifyApp.log.info('MongoDB connected.');
    } catch (err) {
      this.fastifyApp.log.error('Could not connect to MongoDB.', err);
    }
  }

  private setUpSwagger() {
    this.fastifyApp.log.info('Generating Swagger Docs...');

    this.fastifyApp.register(fastifySwagger, {
      swagger: {
        info: {
          title: 'Data Microservice - API Documentation',
          version: '0.0.1',
          description: 'This is the API documentation for the microservice managing data for users and departments.'
        },
        consumes: ['application/json'],
        produces: ['application/json'],
        tags: CommonSchemaTags,
      },
      exposeRoute: true,
      routePrefix: '/api-docs'
    });

    this.fastifyApp.log.info('Swagger Docs is successfully generated and available at /api-docs.');
  }

  private setUpAPIRoutes(): void {
    this.apiRoutes.initialize();
  }
}

export default new App().fastifyApp;
