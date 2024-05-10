import userModel from "./models/userModel.js";
import { isValidPassword } from "../utils/cryptoUtil.js";

class UserManager {

    async getUsers() {
      try {
        return await userModel.find();
      } catch (error) {
        throw new Error("Error finding Users!");
      }
    }

    async getUser(uid) {
      try {
        return await userModel.find({_id: uid});
      } catch (error) {
        throw new Error("User not found!");
      }
    }

    async addUser() {
        const { first_name, last_name, email, age, password } = user;

        if (!first_name || !last_name || !email || !age || !password) {
            throw new Error('User could not be created!');
        }

        try {
            await userModel.create({ first_name, last_name, email, age, password });

            return "User created succesfully";
        } catch (error) {
            throw new Error('User could not be created!');
        }
    }

    async loginUser(email, password) {
        if (!email || !password) {
          throw new error("Invalid credentials!");
        }
        try {
          const user = await userModel.findOne({email});

          if (!user) throw new Error('Invalid user!');

          if (isValidPassword(user, password)) {
            return user;
          }
        } catch (error) {
          throw new error("Login Error!");
        }
    }
}
  
export default UserManager;