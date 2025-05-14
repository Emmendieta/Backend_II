/* VER TODO ESTE SI ESTA OK!!!! */

import { Schema, Types, model } from "mongoose";

const collection = "carts";
const schema = new Schema(
    {

    }, 
    { timestamps: true }
);

const Cart = model(collection, schema);
export default Cart;