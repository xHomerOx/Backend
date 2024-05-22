import userModel from '../models/userModel.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';

class UserDao {
    constructor() {}

    static getInstance() {
        if (!UserDao.instance) {
            UserDao.instance = new UserDao();
            UserDao.instance.userModel = new userModel();
        }
        return UserDao.instance;
    }

    async addUser(user, email, password) {
        try {
            const existingUser = await userModel.findOne({ email });
    
            if (existingUser) {
                throw new Error(`User with email ${email} already exists!`);
            } else {
                const newUser = {
                    user,
                    email,
                    password: createHash(password)
                };
                await userModel.create(newUser);
                return newUser;
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUser(user, password) {
        try {
            if (!user || !password) {
                throw new Error("User and password are required!");
            }
    
            const myUser = await userModel.findOne({ user });
    
            if (!myUser) {
                throw new Error(`User does not exist!`);
            }
    
            const isValid = isValidPassword(myUser, password);
            
            if (!isValid) {
                throw new Error(`Incorrect Password!`);
            }

            delete myUser.password;
            return myUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

const instance = new UserDao();
export default instance;