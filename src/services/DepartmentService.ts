import fetch from 'node-fetch';
import DepartmentModel from '@models/Department';
import CONFIG from '@constants/config';

class DepartmentService {
  public static async syncDepartmentsFromScratch() {
    await DepartmentModel.deleteMany({});

    const response = await fetch(CONFIG.API_URL.DEPARTMENTS.GET_ALL);
    const body = await response.json();

    return await Promise.all(body.map(department => DepartmentService.createNewDepartment(department)));
  }

  public static async syncMultipleDepartments(departmentIds) {
    return Promise.all(departmentIds.map(departmentId => DepartmentService.syncSingleDepartment(departmentId)));
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
