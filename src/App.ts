import fastify from 'fastify';
import fastifySwagger from 'fastify-swagger';
import mongoose from 'mongoose';
import cron from 'node-cron';

import APIRoutes from '@routes/Routes';
import CommonSchemaTags from '@schemas/common/tags';
import globalPublisher from '@pubsub/global/Publisher';
import SyncStateService from '@state/SyncStateService';
import UserService from '@services/UserService';
import DepartmentService from '@services/DepartmentService';
import SyncType from '@models/enums/SyncType';
import SyncStatus from '@models/enums/SyncStatus';
import { DEFAULT_USER } from '@constants/common';

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
    this.setUpRabbitMQ();
    this.setUpSwagger();
    this.setUpAPIRoutes();
    this.configPostRouteMiddlewares();
    this.setUpCronJob();
  }

  private configPreRouteMiddlewares(): void {

  }

  private configPostRouteMiddlewares(): void {

  }

  private async connectToDatabase(): Promise<any> {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:28018/dms3';

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
          version: '0.1.0',
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

  private setUpRabbitMQ() {
    this.fastifyApp.log.info('Setting up RabbitMQ...');

    globalPublisher.setLogger(this.fastifyApp.log);
    globalPublisher.createQueue('user_sync', { durable: true });
    globalPublisher.createQueue('department_sync', { durable: true });
  }

  private setUpAPIRoutes(): void {
    this.apiRoutes.initialize();
  }

  private setUpCronJob(): void {
    cron.schedule("0 */45 * * * *", async () => {
      this.fastifyApp.log.info('Syncing users from User Service...');
      const newSyncState = await SyncStateService.createNewSyncState({ type: SyncType.ALL_USERS_SYNC, issuedBy: DEFAULT_USER });

      UserService.syncUsersFromScratch()
        .then(() => {
          SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
          this.fastifyApp.log.info('Successfully completed syncing users');
        })
        .catch(error => {
          SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
          this.fastifyApp.log.error('Failed to sync users', error);
        });
    });

    cron.schedule("0 */50 * * * *", async () => {
      const newSyncState = await SyncStateService.createNewSyncState({ type: SyncType.ALL_DEPARTMENTS_SYNC, issuedBy: DEFAULT_USER });

      DepartmentService.syncDepartmentsFromScratch()
        .then(() => {
          SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
          this.fastifyApp.log.info('Successfully completed syncing departments');
        })
        .catch(error => {
          SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
          this.fastifyApp.log.error('Failed to sync departments', error);
        });
    });

    this.fastifyApp.log.info('Cron jobs have been set up');
  }
}

export default new App().fastifyApp;
