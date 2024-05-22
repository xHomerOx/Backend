import userModel from '../models/userModel.js';
import { createHash } from '../utils/cryptoUtil.js';

class UserDao {
    constructor() {}

    static getInstance() {
        if (!UserDao.instance) {
            UserDao.instance = new UserDao();
            UserDao.instance.userModel = new userModel();
        }
        return UserDao.instance;
    }

    async addUser() {
        const existingUser = await userModel.findOne({ user });

        let newUser =  {
            user,
            password: createHash(password)
        }

        if (existingUser || user === "admincoder@coder.com") {
            throw new Error(`User ${user} already exists!`);
        } else { 
            await userModel.create(newUser);
        }
    }

    async getUser(user) {
        try {
          const myUser = await userModel.findOne({ user });
          return myUser;
        } catch (error) {
          throw new Error(error.message);
        }
    }
}

const instance = new UserDao();
export default instance;