import { Router } from "express";
import setupResponses from "../middlewares/setupResponses.mid.js";

class RouterHelper {
    constructor() {
        this.router = Router();
        this.use(setupResponses);
    }
    getRouter = () => this.router;
    
    //Función que aplica todas las lógicas que se repiten pero para API:
    applyMiddlewares = (middelwares) => middelwares.map((mid) => async(req, res, next) => {
        try {
            await mid(req, res, next);
        } catch (error) {
            next(error);
        }
    });

    applyMiddelwaresRender = (middelwaresRender) => middelwaresRender.map(midRend => async(req, res, next) => {
        try {
            await midRend(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).render("error", { error });
        }
    });
    
    /* Métodos CRUD */
    //Create:
    create = (path, ...middelwares) => this.router.post(path, this.applyMiddlewares(middelwares));
    //Read:
    read = (path, ...middelwares) => this.router.get(path, this.applyMiddlewares(middelwares)); 
    //Update:
    update = (path, ...middelwares) => this.router.put(path, this.applyMiddlewares(middelwares));
    //Delete:
    destroy = (path, ...middelwares) => this.router.delete(path, this.applyMiddlewares(middelwares));

    //Use:
    use = (path, ...middelwares) => this.router.use(path, this.applyMiddlewares(middelwares));
    //Render:
    render = (path, ...middelwaresRender) => this.router.get(path, this.applyMiddelwaresRender(middelwaresRender));
}

export default RouterHelper;