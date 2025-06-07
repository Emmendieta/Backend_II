const { PERSISTENCE } = process.env;
import crypto from "crypto";

class CartsDTO {
    constructor(data = {}) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        }
        this.products = data.products || [];
        this.close = data.close|| false;
        if (PERSISTENCE !== "mongo") {
            this.createdAt = new Date();
            this.updateAt = new Date();
        }
    };
}

export default CartsDTO;