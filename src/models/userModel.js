import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
    user: {
        type: String,
        minLength: 3,
        required: true
    },
    password: {
        type: String,
        minLength: 3
    },
    email: {
        type: String,
        unique: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts"
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;