import { isValidObjectId } from "mongoose";
import { cartsService, productsService } from "../services/service.js";

class CartsController {
    constructor() {
        this.service = cartsService;   
        this.pService = productsService;
    };

    createOne = async (req, res) => {
        const data = req.body;
        const response = await this.service.createOne(data);
        res.json201(response);
    };

    readAll = async (req, res) => {
        const response = await this.service.readAll();
        if (response.length === 0) { res.json404("Carts Not Found!"); }
        res.json200(response);
    };

    readByFilter = async (req, res) => {

    };

    readById = async (req, res) => {
        const { cid } = req.params;
        if (!isValidObjectId(cid)) { res.json400("Cart id invalid!"); }
        const response = await this.service.readById(cid);
        res.json200(response);
    };

    updateById = async (req, res) => {
        const { cid } = req.params;
        const data = req.body;
        if (!isValidObjectId(cid)) { res.json400("Cart id invalid!"); }
        const response = await this.service.updateById(cid, data);
        res.json200(response);
    };

    destroyById = async (req, res) => {
        const { cid } = req.params;
        const response = await this.service.destroyById(cid);
        res.json200(response);
    };

    productsCart = async (req, res) => {
        const { cid } = req.params;
        const response = await this.service.readById(cid);
        const products = response.products;
        res.json200(products);
    };

    finalizeCart = async (req, res) => {
    const { cid } = req.params;
    if (!isValidObjectId(cid)) return res.json400("Invalid cart ID!");
    const cart = await this.service.readById(cid);
    if (!cart) { return res.json404("Cart not found"); }
    const updatedProducts = [];
    const stockUpdates = [];
    //Valido el stock:
    for (const item of cart.products) {
        const product = await this.pService.readById(item.product);
        if (!product) return res.json404(`Product ${item.product} not found`);
        const newStock = product.stock - item.quantity;
        if (newStock < 0) { return res.json400(`Not enough stock for product: ${product.title}`); }
        stockUpdates.push({ pid: product._id, newStock });
    }
    //Actualizo el stock de productos:
    for (const { pid, newStock } of stockUpdates) { await this.pService.updateById(pid, { stock: newStock }); }
    //Cierro el carrito:
    const updatedCart = await this.service.updateById(cid, { close: true });
    res.json200({ message: "Cart finalized and stock updated", cart: updatedCart });
}
}

const cartsController = new CartsController();

export default cartsController;