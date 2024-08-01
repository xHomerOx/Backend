import UserDto from '../dto/userDTO.js'

class UserRepository {
  constructor(dao) {
      this.dao = dao;
  }

  async addUser(user, email, password) {
      try {
        const newUser = await this.dao.addUser(user, email, password);
        return new UserDto(newUser);
      } catch (error) {
        throw new Error(error.message);
      }
  }

  async loginUser(user, password) {
      try {
          const myUser = await this.dao.loginUser(user, password);
          return myUser;
      } catch (error) {
          throw new Error(error.message);
      }
  }

  async logoutUser(user) {
    try {
        const myUser = await this.dao.logoutUser(user);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
}

  async getUser(user) {
    try {
        const myUser = await this.dao.getUser(user);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getUsers() {
    try {
        const myUsers = await this.dao.getUsers();
        return myUsers;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getUsersById() {
    try {
        const myUsers = await this.dao.getUsersById();
        return myUsers;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async deleteUsers() {
    try {
        const myUsers = await this.dao.deleteUsers();
        return myUsers;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getUserByToken(token) {
    try {
        const myUser = await this.dao.getUserByToken(token);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async updatePassword(uid, newPassword) {
    try {
        const myUser = await this.dao.updatePassword(uid, newPassword);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async getUserEmail(email) {
    try {
        const myUser = await this.dao.getUserEmail(email);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
  }

  async updateRole(uid, newRole, documents) {
    try {
        const myUser = await this.dao.updateRole(uid, newRole, documents);
        return myUser;
    } catch (error) {
        throw new Error(error.message);
    }
  }
}

export default UserRepository;