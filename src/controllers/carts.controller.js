import { isValidObjectId } from "mongoose";
import cartsService from "../services/carts.service.js";

class CartsController {
    constructor() {
        this.service = cartsService;   
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
}

const cartsController = new CartsController();

export default cartsController;