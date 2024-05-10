import userModel from "./models/userModel.js";

class UserManager {

    async getUsers() {
      try {
        return await userModel.find();
      } catch (error) {
        throw new Error("Error finding Users!");
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

    async loginUser() {
        
    }
}
  
  export default UserManager;