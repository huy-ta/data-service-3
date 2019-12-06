import { RouteOptions, FastifyRequest, FastifyReply } from 'fastify';
import { ServerResponse } from 'http';
import BaseController from '@routes/BaseController';
import { TAGS } from '@schemas/common/tags';
import DepartmentService from '@services/DepartmentService';
import SyncStateService from '@state/SyncStateService';
import { DEFAULT_USER } from '@constants/common';
import SyncType from '@models/enums/SyncType';
import SyncStatus from '@models/enums/SyncStatus';
import DepartmentModel from '@models/Department';
import NotFound404 from '@models/responses/NotFound404';

class DepartmentController extends BaseController {
  public getRoutes(): RouteOptions[] {
    return [
      {
        method: 'GET',
        url: '/',
        handler: this.getAllDepartments,
        schema: {
          tags: [TAGS.DEPARTMENTS]
        }
      },
      {
        method: 'GET',
        url: '/:departmentId',
        handler: this.getDepartment,
        schema: {
          tags: [TAGS.DEPARTMENTS]
        }
      },
      {
        method: 'POST',
        url: '/all-sync',
        handler: this.syncDepartmentsFromScratch,
        schema: {
          tags: [TAGS.DEPARTMENTS],
        }
      },
      {
        method: 'POST',
        url: '/single-sync',
        handler: this.syncSingleDepartment,
        schema: {
          tags: [TAGS.DEPARTMENTS]
        }
      },
      {
        method: 'POST',
        url: '/multiple-sync',
        handler: this.syncMultipleDepartments,
        schema: {
          tags: [TAGS.DEPARTMENTS]
        }
      }
    ];
  }

  private async getAllDepartments(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const departments = await DepartmentModel.find({});

    return reply.send(departments);
  }

  private async getDepartment(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const department = await DepartmentModel.findOne({ id: request.params.departmentId });

    if (!department) {
      return reply.status(404).send(NotFound404.generate(`Department with id '${request.params.departmentId}' was not found`));
    }

    return reply.send(department);
  }

  private async syncDepartmentsFromScratch(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const newSyncState = await SyncStateService.createNewSyncState({ type: SyncType.ALL_DEPARTMENTS_SYNC, issuedBy: DEFAULT_USER });

    DepartmentService.syncDepartmentsFromScratch()
      .then(() => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
      })
      .catch(error => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
      });

    reply.send({ 
      message: 'The request to synchronize all departments has been accepted',
      syncState: newSyncState
    });
  }

  private async syncMultipleDepartments(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { departmentIds } = request.body;

    const newSyncState = await SyncStateService.createNewSyncState({ 
      type: SyncType.MULTIPLE_DEPARTMENTS_SYNC,
      issuedBy: DEFAULT_USER,
      details: { departmentIds }
    });

    DepartmentService.syncMultipleDepartments(request.body.departmentIds)
      .then(() => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.SUCCESSFUL });
      })
      .catch(error => {
        SyncStateService.updateSyncStateById(newSyncState._id, { status: SyncStatus.FAILED, error });
      });

    reply.send({ 
      message: 'The request to synchronize multiple departments has been accepted',
      syncStateId: newSyncState._id
    });
  }

  private async syncSingleDepartment(request: FastifyRequest, reply: FastifyReply<ServerResponse>): Promise<any> {
    const { departmentId } = request.body;

    const newSyncState = await SyncStateService.createNewSyncState({
      type: SyncType.SINGLE_USER_SYNC,
      issuedBy: DEFAULT_USER,
      details: { departmentId }
    });

    DepartmentService.syncSingleDepartment(departmentId)
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

export default new DepartmentController().initialize;
