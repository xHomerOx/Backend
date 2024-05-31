import UserDto from "../dto/userDTO.js";

class UserRepository {
    constructor(dao) {
        this.dao = dao;
    }

    async addUser(user, email, password) {
        try {
            const existingUser = await this.dao.getUser(user);

            if (existingUser) {
                throw new Error(`User with email ${email} already exists!`);
            } else {
                const newUser = {
                    user,
                    email,
                    password: createHash(password)
                };
                await this.dao.addUser(newUser);
                return new UserDto(newUser);
            }
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUser(user, password) {
        try {
            if (!user ||!password) {
                throw new Error("User and password are required!");
            }

            const myUser = await this.dao.getUser(user);

            if (!myUser) {
                throw new Error(`User does not exist!`);
            }

            const isValid = isValidPassword(myUser, password);

            if (!isValid) {
                throw new Error(`Incorrect Password!`);
            }

            return new UserDto(myUser);
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

export default UserRepository;