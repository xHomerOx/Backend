import userModel from "./models/userModel.js";
import { isValidPassword } from "../utils/cryptoUtil.js";
import jwt from "jsonwebtoken";
import moment from 'moment-timezone';

class UserManager {

    async getUsers() {
      try {
        return await userModel.find().lean();
      } catch (error) {
        throw new Error("Error finding Users!");
      }
    }

    async getUser(uid) {
      try {
        return await userModel.findOne({ _id: uid }).lean();
      } catch (error) {
        throw new Error("User not found!");
      }
    }

    async getUserEmail(email) {
      try {
        const user = await userModel.findOne({ email }).lean();

        if (!user) {
          throw new Error("Email not found!");
        }
    
        return user;
      } catch (error) {
        throw new Error("Email not found!");
      }
    }

    async addUser(user) {
        const { first_name, last_name, email, age, password } = user;

        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('User could not be created!');
        }

        const emailExists = await userModel.findOne({ email }).lean();
        
        if (emailExists) {
          new Error("User already exists");
        }

        try {
          await userModel.create({ first_name, last_name, email, age, password });

          return "User created succesfully";
        } catch (error) {
          throw new Error('One or more fields are wrong or not in correct format!');
        }
    }

    async loginUser(email, password) {
        if (!email || !password) {
          throw new Error("Invalid credentials!");
        }
        try {
          const user = await userModel.findOne({ email }).lean();
          
          if (!user) throw new Error('Invalid user!');

          if (isValidPassword(user, password)) {
            
            const timeZone = moment().tz('America/Argentina/Buenos_Aires');
            const utcOffset = timeZone.utcOffset();
            const lastConnection = new Date(timeZone.valueOf() + utcOffset * 60000);

            await userModel.findByIdAndUpdate(user._id, { last_connection: lastConnection });

            const token = jwt.sign(user, "secretKey", { expiresIn: "1h" });

            return { token, user };
          }else{
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

    async updateRole(uid, newRole ) {
      try {
        await userModel.updateOne({ _id: uid }, { $set: { role: newRole } });
        
        return "Role updated successfully!";
      } catch (error) {
        throw new Error("Error updating role!");
      }
    }
}
  
export default UserManager;