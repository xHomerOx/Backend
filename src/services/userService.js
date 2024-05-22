import UserDAO from '../dao/userDao.js';

class UserService {

  constructor() {
    this.userDAO = UserDAO.instance;
  }

  async addUser(user, password) {
    try {
        const existingUser = await this.userDAO.getUser(user);
  
        if (existingUser || user === "admincoder@coder.com") {
          throw new Error("User already exists!");
        }
  
        const newUser = {
          user,
          password: createHash(password),
        };
  
        await this.userDAO.addUser(newUser);
        return newUser;
      } catch (error) {
        throw new Error(error.message);
      }
  }

  async getUser(user, password) {
    try {
      const myUser = await this.userDAO.getUser(user);

      if (!myUser) {
        throw new Error(`User does not exists!`);
      }

      if (!isValidPassword(myUser, password)) {
        throw new Error(`Incorrect Password!`);
      }

      delete myUser.password;

      return myUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

}

export default UserService;