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
        const { id } = req.params;
        const response = await productsManager.readById(id);
        if (!response) { res.json404(); }
        res.json200(response);
};

const updateById = async (req, res) => {
        const { id } = req.params;
        const data = req.body;
        const response = await productsManager.updateById(id, data);
        if (!response) { res.json404(); }
        res.json200(response);
};

const destroyById = async (req, res) => {
        const { id } = req.params;
        const response = await productsManager.destroyById(id);
        if (!response) { res.json404(); }
        res.json200(response);
};

const forbiddenOpts = { session: false, failureRedirect: "/api/auth/forbidden" };

class ProductsRotuer extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/", passport.authenticate("admin", forbiddenOpts), createOne);
        //productsRouter.post("/", createOne);
        this.read("/", readAll);
        this.read("/:pid", readById);
        this.update("/:pid", passport.authenticate("admin", forbiddenOpts), updateById);
        //productsRouter.put("/:id", updateById);
        this.destroy("/:pid", passport.authenticate("admin", forbiddenOpts), destroyById);
        this.destroy("/:id", destroyById);
    }
};

const productsRouter = (new ProductsRotuer()).getRouter();
export default productsRouter;