import userModel from '../../models/userModel.js';
import { createHash, isValidPassword } from '../../utils/cryptoUtil.js';
import jwt from "jsonwebtoken";
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

    async loginUser(user, password) {
        if (!user || !password) {
          throw new Error("Invalid credentials!");
        }
        try {
          const myUser = await userModel.findOne({ user }).lean();
          
          if (!myUser) throw new Error('Invalid user!');

          if (isValidPassword(myUser, password)) {
            const token = jwt.sign(myUser, "secretKey", { expiresIn: "1h" });

            return token;
          }else{
            throw new Error("Invalid Password!");
          }
        } catch (error) {
          throw new Error("Login Error!");
        }
    }

    async getUser(uid) {
        try {
            return await userModel.findOne({_id: uid}).lean();
        } catch (error) {
            throw new Error("User not found!");
        }
    }
}

export default UserDao;