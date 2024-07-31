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
        if (!user ||!password) {
          throw new Error("Invalid credentials!");
        }
        try {
          const myUser = await userModel.findOne({ user }).lean();
      
          if (!myUser) throw new Error('Invalid user!');
      
          if (isValidPassword(myUser, password)) {
            const token = jwt.sign(myUser, "secretKey", { expiresIn: "1h" });
      
            return {
              status: "success",
              token,
              user,
              role: myUser.role
            };
          } else {
            throw new Error("Invalid Password!");
          }
        } catch (error) {
          throw new Error("Login Error!");
        }
      }

      async getUser(uid) {
        if (!uid) {
            throw new Error("Invalid user ID!");
        }
        
        try {
            const user = await userModel.findOne({ _id: uid }).lean();
            if (!user) throw new Error('User not found!');
        
            return {
                status: 'success',
                payload: user
            };
        } catch (error) {
            throw new Error("Error getting user!");
        }
      }

    async getUsers() { 
      try {
        const users = await userModel.find().exec();

        const userData = users.map(user => ({
          user: user.user,
          email: user.email,
          role: user.role
        }));

        return {
            status: 'success',
            payload: userData
        };
      } catch (error) {
          throw new Error("Error getting users!");
      }
    }
}

export default UserDao;