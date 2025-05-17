import { Router } from "express";
import { productsManager } from "../../data/managers/mongo/manager.mongo.js";
import passport from "passport";
import RouterHelper from "../../helpers/router.helper.js";

const createOne = async (req, res) => {

        const { method, originalUrl: url } = req;
        const data = req.body;
        const response = await productsManager.createOne(data);
        res.status(201).json({ response, method, url });

};

const readAll = async (req, res) => {

        const { method, originalUrl: url } = req;
        const filter = req.query;
        const response = await productsManager.readAll(filter);
        if (response.length === 0) {
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ response, method, url });

};

const readById = async (req, res) => {

        const { method, originalUrl: url } = req;
        const { id } = req.params;
        const response = await productsManager.readById(id);
        if (!response) {
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ response, method, url });

};

const updateById = async (req, res) => {

        const { method, originalUrl: url } = req;
        const { id } = req.params;
        const data = req.body;
        const response = await productsManager.updateById(id, data);
        if (!response) {
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ response, method, url });

};

const destroyById = async (req, res) => {

        const { method, originalUrl: url } = req;
        const { id } = req.params;
        const response = await productsManager.destroyById(id);
        if (!response) {
            const error = new Error("Not Found");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({ response, method, url });

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