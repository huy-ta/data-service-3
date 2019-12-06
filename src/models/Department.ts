import { prop, getModelForClass } from '@typegoose/typegoose';

class Department {
  @prop({ unique: true, required: true, index: true })
  public id!: number;

  @prop({ required: true })
  public organizationCode!: string;

  @prop({ required: true })
  public organizationName!: string;

  @prop()
  public organizationDescription?: string;
}

const DepartmentModel = getModelForClass(Department);

export { Department, DepartmentModel };

export default DepartmentModel;
