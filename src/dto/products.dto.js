const { PERSISTENCE } = process.env;
import crypto from "crypto";

class ProductsDTO {
    constructor(data) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        }
        this.title = data.title;
        this.description = data.description;
        this.code = data.code;
        this.price = data.price;
        this.status = data.status;
        this.stock = data.stock || 0;
        this.category = data.category;
        this.image = data.image;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        }
    };
}

export default ProductsDTO;