import { userService } from "../repositories/index.js";

class UserController {

    async loginUser(user, password) {
        return await userService.loginUser(user, password);
    }

    async logoutUser(user) {
        return await userService.logoutUser(user);
    }

    async getUser(user) {
        return await userService.getUser(user);
    }

    async addUser(user, email, password) {
        return await userService.addUser(user, email, password);
    }

    async getUsers() {
        return await userService.getUsers();
    }

    async deleteUsers() {
        return await userService.deleteUsers();
    }

    async getUserByToken(token) {
        return await userService.getUserByToken(token);
    }

    async getUserEmail(email) {
        return await userService.getUserEmail(email);
    }
}

export default UserController;