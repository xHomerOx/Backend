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
    },
    documents: [
        { name: String, reference: String }
    ],
    last_connection: {
        type: Date
    }
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;