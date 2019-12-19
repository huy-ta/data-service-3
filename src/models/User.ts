import { prop, getModelForClass } from '@typegoose/typegoose';
import Gender from './enums/Gender';
import UserStatus from './enums/UserStatus';

class User {
  @prop({ unique: true, required: true, index: true })
  public id!: number;

  @prop({ required: true })
  public name!: string;

  @prop({ enum: Gender })
  public gender?: Gender;

  @prop()
  public email?: string;

  @prop()
  public phoneNumber?: string;

  @prop()
  public address?: string;

  @prop({ required: true })
  public statusId!: UserStatus;

  @prop()
  public birthday?: number;

  @prop({ required: true })
  public dateCreated!: number;

  @prop({ required: true })
  public lastUpdate!: number;
}

const UserModel = getModelForClass(User);

export { User, UserModel };

export default UserModel;
