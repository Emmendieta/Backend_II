import { Schema, model } from "mongoose";

const collection = "users";
const schema = new Schema(
    {
        first_name: { type: String, require: true },
        last_name: { type: String, require: true },
        email: { type: String, required: true, unique: true, index: true },
        age: { type: Number, require: true },
        cart: { type: String }, /*DESPUES HAY QUE MODIFICAR ESTO PARA HACER REFERENFCIA A LOS CARTS*/
        role: { type: String, default: "USER", enum: ["USER", "ADMIN"], index: true },
    },
    { timestamps: true }
);

const User = model(collection, schema);
export default User;