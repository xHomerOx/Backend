import userModel from '../../models/userModel.js';
import { createHash, isValidPassword } from '../../utils/cryptoUtil.js';
import jwt from "jsonwebtoken";

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
        try {
            if (!user || !password) {
                throw new Error("User and password are required!");
            }

            const myUser = await userModel.findOne({ user });

            if (!myUser) {
                throw new Error(`User does not exist!`);
            }

            if (isValidPassword(myUser, password)) {
                const payload = {
                    id: myUser._id,
                    user: myUser.user,
                    email: myUser.email,
                    role: myUser.role
                };
                const token = jwt.sign(payload, "secretKey", { expiresIn: "1h" });
                return { token, user: myUser.user };
            } else {
                throw new Error("Invalid Password!");
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUser(uid) {
        try {
            return await userModel.findOne({_id: uid}).lean();
        } catch (error) {
            throw new Error("User not found!");
        }
    }
}

export default UserDao;