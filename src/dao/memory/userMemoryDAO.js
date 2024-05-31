class UserDao {
    constructor() {
        this.users = [];
    }

    static getInstance() {
        if (!UserDao.instance) {
            UserDao.instance = new UserDao();
        }
        return UserDao.instance;
    }

    async addUser(user, email, password) {
        try {
            const existingUser = this.users.find(u => u.email === email);

            if (existingUser) {
                throw new Error(`User with email ${email} already exists!`);
            } else {
                const newUser = {
                    user,
                    email,
                    password: createHash(password)
                };
                this.users.push(newUser);
                return newUser;
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

            const myUser = this.users.find(u => u.user === user);

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

export default UserDao;