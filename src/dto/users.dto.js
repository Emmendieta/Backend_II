const { PERSISTENCE } = process.env;
import crypto from "crypto";
import { createHash } from "../helpers/hash.helper.js";

class UsersDTO {
    constructor(data) {
        if (PERSISTENCE !== "mongo") {
            this._id = crypto.randomBytes(12).toString("hex");
        }
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.email = data.email;
        this.age = data.age;
        this.cart = data.cart || [];
        this.password = data.password;
        this.role = data.role || "USER";
        this.verifyCode = data.verifyCode || crypto.randomBytes(12).toString("hex");
        if (PERSISTENCE !== "mongo") {
            this.isVerified = data.isVerified || false;
            this.createdAt = new Date();
            this.updateAt = new Date();
            this.password = createHash(data.password);
        }
    };
}

export default UsersDTO;