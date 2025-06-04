import { productsService } from "../services/service.js";

class ProductsController {
    constructor() {
        this.service = productsService;
    }
    createOne = async (req, res) => {
        const data = req.body;
        const response = await this.service.createOne(data);
        res.json201(response, "Product Created!!!");
    };

    readAll = async (req, res) => {
        const filter = req.query;
        const response = await this.service.readAll(filter);
        if (response.length === 0) { res.json404(); }
        res.json200(response);
    };

    readById = async (req, res) => {
        const { pid } = req.params;
        const response = await this.service.readById(pid);
        if (!response) { res.json404(); }
        res.json200(response);
    };

    updateById = async (req, res) => {
        const { pid } = req.params;
        const data = req.body;
        const response = await this.service.updateById(pid, data);
        if (!response) { res.json404(); }
        res.json200(response);
    };

    destroyById = async (req, res) => {
        const { pid } = req.params;
        console.log(pid)
        const response = await this.service.destroyById(pid);
        if (!response) { res.json404(); }
        res.json200(response);
    };
}

const productsController = new ProductsController();

export default productsController;
