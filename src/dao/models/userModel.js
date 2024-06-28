import mongoose from "mongoose";
import { createHash } from "../../utils/cryptoUtil.js";

const userCollection = "users";

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        hash: true,
        minLength: 6,
        require: true
    },
    cart: {
        type: [
            {
                cart: {
                    type: mongoose.Schema.ObjectId,
                    ref: "carts"
                }
            }
        ],
        default: []
    },
    role: {
        type: String,
        require: true,
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    }
});

userSchema.pre("save", function() {
    this.password = createHash(this.password);
});

const userModel = mongoose.model(userCollection, userSchema);

export default userModel;