import { FastifyInstance, RouteOptions } from 'fastify';

abstract class BaseController {
  constructor() {
    this.initialize = this.initialize.bind(this);
  }

  public initialize(fastifyApp: FastifyInstance, opts, next): void {
    this.getRoutes().forEach(routeOpts => fastifyApp.route(routeOpts));

    next();
  }

  public getRoutes(): RouteOptions[] {
    throw new Error('You must override this method.');
  }
}

export default BaseController;
