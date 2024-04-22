import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    user: {
        type: String,
        minLength: 3,
        require: true
    },
    pass: {
        type: String,
        minLength: 3,
        require: true
    },
    role: {
        type: String,
        require: true
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;