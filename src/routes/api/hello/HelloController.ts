import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import HelloSchemaModels from '@schemas/hello/models';
import { TAGS } from '@schemas/common/tags';

class HelloController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/',
        handler: this.sayHello,
        schema: {
          tags: [TAGS.HELLO],
          response: {
            200: HelloSchemaModels.Hello
          }
        }
      }
    ];
  }

  private sayHello(request: FastifyRequest, reply: FastifyReply<ServerResponse>): void {
    reply.send({ message: 'Hello World!' });
  }
}

export default new HelloController().initialize;
