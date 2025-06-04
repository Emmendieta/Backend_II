import { Schema, model } from "mongoose";

const collection = "products";
const schema = new Schema(
    {
        title: {type: String, require: true},
        description: {type: String, require: true},
        code: {type: String, require: true},
        price: {type: Number, require: true},
        status: {type: Boolean, require: true},
        stock: {type: Number, require: true, default: 0},
        category: {type: String, require: true},
        image: {type: String, require: true}
    }, 
    { timestamps: true }
);

const Product = model(collection, schema);

export default Product;