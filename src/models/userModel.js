import mongoose from "mongoose";

const userCollection = "users";

const userSchema = mongoose.Schema({
    user: {
        type: String,
        minLength: 3,
        required: true
    },
    password: {
        type: String,
        minLength: 3,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;