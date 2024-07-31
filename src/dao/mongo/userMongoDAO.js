import userModel from '../../models/userModel.js';
import { createHash, isValidPassword } from '../../utils/cryptoUtil.js';
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';
import { transport } from '../../utils/mailerUtil.js';

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
        const twoDaysAgo = new Date(lastConnection.getTime() - 2 * 24 * 60 * 60 * 1000);

        const inactiveUsers = await userModel.find({ last_connection: { $lte: twoDaysAgo } });
        const result = await userModel.deleteMany({ last_connection: { $lte: twoDaysAgo } });

        for (const user of inactiveUsers) {
          const mailOptions = {
            from: 'Node Products <homero.tw@gmail.com>',
            to: user.email,
            subject: 'Account Terminated due Inactivity',
            html: `Your account has been terminated due inactivity.`
          };
    
          await new Promise((resolve, reject) => {
            transport.sendMail(mailOptions, (error, info) => {
              if (error) {
                return reject(error);
              }
              resolve(info);
            });
          });
        }

        return {
          status: 'success',
          deletedCount: result.deletedCount
        };
      } catch (error) {
        console.log(error);
        throw new Error("Error deleting users!");
      }
    }

    async getUserByToken(token) {
      try {
        const myToken = jwt.verify(token, 'secretKey');
        const email = myToken.email;

        return await userModel.findOne({ email }).lean();
      } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
          throw new Error("Token has expired. Please request a new password recovery link.");
        } else {
          throw new Error("Invalid token!");
        }
      }
    }

    async updateRole(uid, newRole, documents) {
      try {
        await userModel.updateOne({ _id: uid }, { $set: { role: newRole } });
        await userModel.findByIdAndUpdate(uid, { $set: { documents: documents } });

        return "Role updated successfully!";
      } catch (error) {
        console.log(error);
        throw new Error("Error updating role!");
      }
    }
}

export default UserDao;