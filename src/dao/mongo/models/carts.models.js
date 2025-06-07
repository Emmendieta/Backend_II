import MONGOOSE from "mongoose";
import { Schema, model } from "mongoose";

const collection = "carts";
const schema = new Schema(
    {
        products: [
            {
                product: {
                    type: MONGOOSE.Schema.Types.ObjectId,
                    ref: "products",
                    required: true
                },
                quantity: {
                    type: Number,
                    require: true,
                    min: 1
                }
            }
        ],
        close: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true }
);

const Cart = model(collection, schema);
export default Cart;