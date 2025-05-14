import { Router } from "express";
import { productsManager } from "../data/managers/mongo/manager.mongo.js";

const viewsRouter = Router();

const indexView = async (req, res) => {
    try {
        const products = await productsManager.readAll();
        res.status(200).render("index", { products }); 
        //FALTA ACA DETERMINAR SI NO SE ENCUENTRA NINGUN PRODUCTO!!!!
    } catch (error) {
        res.status(error.statusCode || 500).render("error", { error });
    }
}

viewsRouter.get("/", indexView);

export default viewsRouter;