import UserService from '../services/userService.js';

const userService = new UserService();

class UserController {
    constructor() {}

    async getUser(req, res) {
        try {
            const { user, password } = req.body;
            const myUser = await userService.getUser(user, password);
            res.status(200).send({ message: myUser });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }

    async addUser(req, res) {
        try {
            const { user, email, password } = req.body;
            if (!user || !email || !password) {
                throw new Error("User, email, and password are required!");
            }

            const newUser = await userService.addUser(user, email, password);

            res.status(201).send({ message: "User created successfully", data: newUser });
        } catch (error) {
            res.status(500).send({ message: error.message });
        }
    }
}

export default UserController;