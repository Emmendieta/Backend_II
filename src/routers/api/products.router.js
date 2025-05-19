import { Router } from "express";
import { productsManager } from "../../data/managers/mongo/manager.mongo.js";
import passport from "passport";
import RouterHelper from "../../helpers/router.helper.js";

const createOne = async (req, res) => {
        const data = req.body;
        const response = await productsManager.createOne(data);
        res.json201(response, "Product Created!!!");

};

const readAll = async (req, res) => {
        const filter = req.query;
        const response = await productsManager.readAll(filter);
        if (response.length === 0) { res.json404(); }
        res.json200(response);
};

const readById = async (req, res) => {
        const { pid } = req.params;
        const response = await productsManager.readById(pid);
        if (!response) { res.json404(); }
        res.json200(response);
};

const updateById = async (req, res) => {
        const { pid } = req.params;
        const data = req.body;
        const response = await productsManager.updateById(pid, data);
        if (!response) { res.json404(); }
        res.json200(response);
};

const destroyById = async (req, res) => {
        const { pid } = req.params;
        console.log(pid)
        const response = await productsManager.destroyById(pid);
        if (!response) { res.json404(); }
        res.json200(response);
};

/* const forbiddenOpts = { session: false, failureRedirect: "/api/auth/forbidden" }; */

class ProductsRotuer extends RouterHelper {
        constructor() {
                super();
                this.init();
        }
        init = () => {
                this.create("/", ["ADMIN"], createOne);
                this.read("/", ["PUBLIC"], readAll);
                this.read("/:pid", ["PUBLIC"], readById);
                this.update("/:pid", ["ADMIN"], updateById);
                this.destroy("/:pid", ["ADMIN"], destroyById);
        }
};

const productsRouter = (new ProductsRotuer()).getRouter();
export default productsRouter;