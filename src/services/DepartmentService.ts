import fetch from 'node-fetch';
import DepartmentModel from '@models/Department';
import CONFIG from '@constants/config';
import globalPublisher from '@pubsub/global/Publisher';

class DepartmentService {
  public static async syncDepartmentsFromScratch() {
    const session = await DepartmentModel.startSession();

    session.startTransaction();

    try {
      await DepartmentModel.deleteMany({});

      const response = await fetch(CONFIG.API_URL.DEPARTMENTS.GET_ALL);
      const body = await response.json();

      await Promise.all(body.map(department => DepartmentService.createNewDepartment(department)));

      session.commitTransaction();
    } catch (err) {
      session.abortTransaction();
      throw err;
    }
  }

  public static async syncMultipleDepartments(departmentIds) {
    const session = await DepartmentModel.startSession();

    session.startTransaction();

    try {
      await Promise.all(departmentIds.map(departmentId => DepartmentService.syncSingleDepartment(departmentId)));

      session.commitTransaction();
    } catch (err) {
      session.abortTransaction();
      throw err;
    }
  }

  public static async syncSingleDepartment(departmentId) {
    const existingDepartment = await DepartmentModel.findOne({ id: departmentId });

    const response = await fetch(`${CONFIG.API_URL.DEPARTMENTS.GET_ONE}${departmentId}`);
    const targetDepartment = await response.json();

    if (!existingDepartment) {
      return DepartmentService.createNewDepartment(targetDepartment);
    }

    const fieldsToUpdate = ['id', 'organizationCode', 'organizationName', 'organizationDescription'];

    fieldsToUpdate.forEach(fieldToUpdate => {
      if (targetDepartment[fieldToUpdate]) {
        existingDepartment[fieldToUpdate] = targetDepartment[fieldToUpdate];
        
        return;
      }

      if (existingDepartment[fieldToUpdate]) {
        delete existingDepartment[fieldToUpdate];
      }
    });

    await existingDepartment.save();

    globalPublisher.sendToQueue('department_sync', JSON.stringify(existingDepartment));

    return existingDepartment;
  }

  public static async createNewDepartment(department) {
    const newDepartment = new DepartmentModel({
      id: department.id,
      organizationCode: department.organizationCode,
      organizationName: department.organizationName
    });

    if (department.organizationDescription) newDepartment.organizationDescription = department.organizationDescription;

    await newDepartment.save();

    return newDepartment;
  }
}

export default DepartmentService;
