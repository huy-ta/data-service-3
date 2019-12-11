import fetch from 'node-fetch';
import UserModel from '@models/User';
import CONFIG from '@constants/config';

class UserService {
  public static async syncUsersFromScratch() {
    const session = await UserModel.startSession();

    session.startTransaction();

    try {
      await UserModel.deleteMany({});

      const response = await fetch(CONFIG.API_URL.USERS.GET_ALL);
      const body = await response.json();

      await Promise.all(body.map(user => UserService.createNewUser(user)));

      session.commitTransaction();
    } catch (err) {
      session.abortTransaction();
      throw err;
    }
  }

  public static async syncMultipleUsers(userIds) {
    const session = await UserModel.startSession();

    session.startTransaction();

    try {
      await Promise.all(userIds.map(userId => UserService.syncSingleUser(userId)));

      session.commitTransaction();
    } catch (err) {
      session.abortTransaction();
      throw err;
    }
  }

  public static async syncSingleUser(userId) {
    const existingUser = await UserModel.findOne({ id: userId });

    const response = await fetch(`${CONFIG.API_URL.USERS.GET_ONE}${userId}`);
    const targetUser = await response.json();

    if (!existingUser) {
      return UserService.createNewUser(targetUser);
    }

    const fieldsToUpdate = ['name', 'email', 'phoneNumber', 'address', 'statusId', 'birthday', 'dateCreated', 'lastUpdate'];

    fieldsToUpdate.forEach(fieldToUpdate => {
      if (targetUser[fieldToUpdate]) {
        existingUser[fieldToUpdate] = targetUser[fieldToUpdate];
        
        return;
      }

      if (existingUser[fieldToUpdate]) {
        delete existingUser[fieldToUpdate];
      }
    });

    await existingUser.save();

    return existingUser;
  }

  public static async createNewUser(user) {
    const newUser = new UserModel({
      id: user.id,
      name: user.name,
      email: user.email,
      phoneNumber: String(user.phoneNumber),
      address: user.address,
      statusId: user.statusId,
      birthday: user.birthday,
      dateCreated: user.dateCreated,
      lastUpdate: user.lastUpdate
    });

    if (user.gender) {
      if (user.gender === 'Nữ') user.gender = 'Nu';
      newUser.gender = user.gender;
    }

    await newUser.save();

    return newUser;
  }
}

export default UserService;
