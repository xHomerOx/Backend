import userModel from '../../models/userModel.js';
import { createHash, isValidPassword } from '../../utils/cryptoUtil.js';
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';

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
            const timeZone = moment().tz('America/Argentina/Buenos_Aires');
            const utcOffset = timeZone.utcOffset();
            const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000);

            await userModel.findByIdAndUpdate(myUser._id, { last_connection: lastConnection });

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

    async logoutUser(user) {
      const timeZone = moment().tz('America/Argentina/Buenos_Aires');
      const utcOffset = timeZone.utcOffset();
      const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000);

      await userModel.findByIdAndUpdate(user._id, { last_connection: lastConnection });
    }

    async updatePassword(uid, newPassword) {
      try {
        await userModel.updateOne({ _id: uid }, { $set: { password: newPassword } });
    
        return "Password updated successfully!";
      } catch (error) {
        throw new Error("Error updating password!");
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

    async deleteUsers() {
      try {
        const timeZone = moment().tz('America/Argentina/Buenos_Aires');
        const utcOffset = timeZone.utcOffset();
        const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000);
        const twoMinutesAgo = new Date(lastConnection.getTime() - 2 * 60 * 1000);
        
        const result = await userModel.deleteMany({ last_connection: { $lte: twoMinutesAgo } });
        console.log("Users to delete:", result);
        
        return {
          status: 'uccess',
          deletedCount: result.deletedCount
        };
      } catch (error) {
        console.log(error);
        throw new Error("Error deleting users!");
      }
    }
}

export default UserDao;