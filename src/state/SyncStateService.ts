import SimpleUser from '@models/pojo/SimpleUser';
import SyncStatus from '@models/enums/SyncStatus';
import SyncType from '@models/enums/SyncType';
import SyncStateModel from '@models/SyncState';

interface ICreateNewSyncStateOptions {
  type: SyncType;
  issuedBy: SimpleUser;
  createdAt?: Date;
  updatedAt?: Date;
  details?: object;
}

class SyncStateService {
  public static async createNewSyncState(options: ICreateNewSyncStateOptions): Promise<any> {
    const newSyncState = new SyncStateModel({
      status: SyncStatus.RUNNING,
      type: options.type,
      createdAt: options.createdAt || new Date(),
      issuedBy: options.issuedBy
    });

    await newSyncState.save();

    return newSyncState;
  }

  public static async getSyncStateById(stateId: string): Promise<any> {
    const syncState = await SyncStateModel.findById(stateId);

    return syncState;
  }

  public static async updateSyncStateById(stateId: string, updateObject): Promise<any> {
    const syncState = await SyncStateModel.findById(stateId);

    if (!syncState) return;

    Object.keys(updateObject).forEach(fieldToUpdate => {
      syncState[fieldToUpdate] = updateObject[fieldToUpdate];
    });

    await syncState.save();

    return syncState;
  }
}

export default SyncStateService;
