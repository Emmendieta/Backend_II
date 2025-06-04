import User from "../mongo/models/users.model.js";
import Product from "../mongo/models/products.model.js";
import Cart from "../mongo/models/carts.models.js";

class DaoFS {
    constructor() { { /* Falta la logica */} }
    createOne = async (data) => { /* Falta la logica */};
    readAll = async (filter) => { /* Falta la logica */};
    readById = async (id) => { /* Falta la logica */};
    readByFilter = async (filter) => { /* Falta la logica */};
    updateById = async (id, data) => { /* Falta la logica */};
    destroyById = async (id) => { /* Falta la logica */};
}

const usersManager = new DaoFS(User);
const productsManager = new DaoFS(Product);
const cartsManager = new DaoFS(Cart);

export { usersManager, productsManager, cartsManager };