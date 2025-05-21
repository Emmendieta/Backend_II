import { isValidObjectId } from "mongoose";
import { cartsManager } from "../../data/managers/mongo/manager.mongo.js";
import RouterHelper from "../../helpers/router.helper.js";

const createOne = async (req, res) => {
    const data = req.body;
    const response = await cartsManager.createOne(data);
    res.json201(response); 
};

const readAll = async (req, res) => {
    const response = await cartsManager.readAll();
    if (response.length === 0) { res.json404("Carts Not Found!"); }
    res.json200(response);
};

const readByFilter = async (req, res) => {

};

const readById = async (req, res) => {
    const { cid } = req.params;
    if(!isValidObjectId(cid)) { res.json400("Cart id invalid!"); }
    const response = await cartsManager.readById(cid);
    res.json200(response);
};

const updateById = async (req, res) => {
    const { cid } = req.params;
    const data = req.body;
    if(!isValidObjectId(cid)) { res.json400("Cart id invalid!"); }
    const response = await cartsManager.updateById(cid, data);
    res.json200(response);
};

const destroyById = async (req, res) => {

};

const productsCart = async (req, res) => {
    const { cid } = req.params;
    const response = await cartsManager.readById(cid);
    const products = response.products;
    res.json200(products);      
};


class CartRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/", ["USER", "ADMIN"], createOne);
        this.read("/", ["ADMIN"], readAll);
        this.read("/:cid", ["USER", "ADMIN"], readById);
        this.update("/:cid", ["USER", "ADMIN"], updateById);
        this.destroy("/:cid", ["USER", "ADMIN"], destroyById);
        this.read("/:cid/products", ["USER", "ADMIN"], productsCart);   
    };
}

const cartsRouter = (new CartRouter()).getRouter();

export default cartsRouter;