import { Schema, model } from "mongoose";
import MONGOOSE from "mongoose";

const collection = "users";
const schema = new Schema(
    {
        first_name: { type: String, require: true },
        last_name: { type: String, require: true },
        email: { type: String, required: true, unique: true, index: true },
        password: { type: String, required: true },
        age: { type: Number, require: true },
        cart: [
            {
                type: MONGOOSE.Schema.Types.ObjectId,
                ref: "carts"
            },
        ],
        role: { type: String, default: "USER", enum: ["USER", "ADMIN"], index: true },
        isVerified: { type: Boolean, default: false },
        verifyCode: { type: String }
    },
    { timestamps: true }
);

const User = model(collection, schema);
export default User;