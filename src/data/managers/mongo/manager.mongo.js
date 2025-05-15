import User from "../../models/users.model.js";
import Product from "../../models/products.model.js";
import Cart from "../../models/carts.models.js";

class Manager {
    constructor(model) {
        this.model = model;
    }
    createOne = async(data) => await this.model.create(data);
    readAll = async(filter) => await this.model.find(filter).lean();
    readById = async(id) => await this.model.findOne( {_id: id}).lean();
    readByFilter = async(filter) => await this.model.findOne(filter).lean();
    updateById = async(id, data) => await this.model.findByIdAndUpdate(id, data, {new: true}).lean();
    destroyById = async(id) => await this.model.findByIdAndDelete(id);
}

const usersManager = new Manager(User);
const productsManager = new Manager(Product);
const cartsManager = new Manager(Cart);

export { usersManager, productsManager,cartsManager };