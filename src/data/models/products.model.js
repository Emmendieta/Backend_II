/* VER TODO ESTE SI ESTA OK!!!! */

import { Schema, Types, model } from "mongoose";

const collection = "products";
const schema = new Schema(
    {

    }, 
    { timestamps: true }
);

const Product = model(collection, schema);
export default Product;