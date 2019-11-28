import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import { TAGS } from '@schemas/common/tags';
import UserService from '@services/UserService';
import SyncStateService from '@state/SyncStateService';
import { DEFAULT_USER } from '@constants/common';
import SyncType from '@models/enums/SyncType';
import SyncStatus from '@models/enums/SyncStatus';
import UserModel from '@models/User';
import NotFound404 from '@models/responses/NotFound404';

class UserController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/:userId',
        handler: this.getUser,
        schema: {
          tags: [TAGS.USERS]
        }
      },
      {
        method: 'POST',
        url: '/all-sync',
        handler: this.syncUsersFromScratch,
        schema: {
          tags: [TAGS.USERS],
        }
      },
      {
        method: 'POST',
        url: '/single-sync',
        handler: this.syncSingleUser,
        schema: {
          tags: [TAGS.USERS]
        }
      },
      {
        method: 'POST',
        url: '/multiple-sync',
        handler: this.syncMultipleUsers,
        schema: {
          tags: [TAGS.USERS]
        }
      }
    ];
  }

  private async getUser(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const user = await UserModel.findOne({ id: request.params.userId });

    if (!user) {
      return reply.status(404).send(NotFound404.generate(`User with id '${request.params.userId}' was not found`));
    }

    return reply.send(user);
  }

  private async syncUsersFromScratch(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const newSyncState = await SyncStateService.createNewSyncState({ type: SyncType.ALL_USERS_SYNC, issuedBy: DEFAULT_USER });

    UserService.syncUsersFromScratch()
      .then(() => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
      })
      .catch(error => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
      });

    reply.send({ 
      message: 'The request to synchronize all users has been accepted',
      syncState: newSyncState
    });
  }

  private async syncMultipleUsers(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { userIds } = request.body;

    const newSyncState = await SyncStateService.createNewSyncState({ 
      type: SyncType.MULTIPLE_USERS_SYNC,
      issuedBy: DEFAULT_USER,
      details: { userIds }
    });

    UserService.syncMultipleUsers(request.body.userIds)
      .then(() => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
      })
      .catch(error => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
      });

    reply.send({ 
      message: 'The request to synchronize multiple users has been accepted',
      syncStateId: newSyncState._id
    });
  }

  private async syncSingleUser(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { userId } = request.body;

    const newSyncState = await SyncStateService.createNewSyncState({
      type: SyncType.SINGLE_USER_SYNC,
      issuedBy: DEFAULT_USER,
      details: { userId }
    });

    UserService.syncSingleUser(userId)
      .then(() => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
      })
      .catch(error => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
      });

    reply.send({ 
      message: 'The request to synchronize a single user has been accepted',
      syncStateId: newSyncState._id
    });
  }
}

export default new UserController().initialize;
