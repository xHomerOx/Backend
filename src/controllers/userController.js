import { userService } from "../repositories/index.js";

class UserController {

    async loginUser(user, password) {
        return await userService.loginUser(user, password);
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
}

export default UserController;