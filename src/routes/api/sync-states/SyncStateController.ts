import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import { TAGS } from '@schemas/common/tags';
import SyncStateService from '@state/SyncStateService';
import NotFound404 from '@models/responses/NotFound404';

class SyncStateController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/:syncStateId',
        handler: this.getSyncState,
        schema: {
          tags: [TAGS.SYNC_STATES],
        }
      }
    ];
  }

  private async getSyncState(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const syncState = await SyncStateService.getSyncStateById(request.params.syncStateId);

    if (!syncState) {
      return reply.status(404).send(NotFound404.generate(`Sync state with the id ${request.params.syncStateId} was not found`));
    }

    reply.send(syncState);
  }
}

export default new SyncStateController().initialize;
