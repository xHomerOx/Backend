import { userService } from "../repositories/index.js";

class ProductController {

    async getUser(user, password) {
        return await userService.getUser(user, password);
    }

    async addUser(user, email, password) {
        return await userService.addUser(user, email, password);
    }
}

export default ProductController;