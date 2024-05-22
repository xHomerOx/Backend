import UserDAO from '../dao/userDao.js';
import { createHash, isValidPassword } from '../utils/cryptoUtil.js';

class UserService {

    constructor() {
        this.userDAO = UserDAO;
    }

    async addUser(user, email, password) {
        try {
            await this.userDAO.getUser(user);
            
            const newUser = {
                user,
                email,
                password: createHash(password),
            };

            await this.userDAO.addUser(user, email, password);
            return newUser;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getUser(user, password) {
        try {
            if (!user || !password) {
                throw new Error("User and password are required!");
            }
    
            const myUser = await this.userDAO.getUser(user, password);
    
            if (!myUser) {
                throw new Error(`User does not exist!`);
            }
    
            const isValid = isValidPassword(myUser, password);
    
            if (!isValid) {
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