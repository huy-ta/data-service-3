import { prop, getModelForClass } from '@typegoose/typegoose';
import SyncStatus from './enums/SyncStatus';
import SyncType from './enums/SyncType';
import { DEFAULT_USER } from '@constants/common';
import SimpleUser from './pojo/SimpleUser';

class SyncState {
  @prop({ required: true, enum: SyncStatus })
  public status!: SyncStatus;

  @prop({ required: true, enum: SyncType })
  public type!: SyncType;

  @prop({ default: new Date() })
  public createdAt?: Date;

  @prop({ default: new Date() })
  public updatedAt?: Date;

  @prop({ default: DEFAULT_USER })
  public issuedBy?: SimpleUser;

  @prop()
  public error?: object;

  @prop()
  public details?: object;
}

const SyncStateModel = getModelForClass(SyncState);

export { SyncState, SyncStateModel };

export default SyncStateModel;
