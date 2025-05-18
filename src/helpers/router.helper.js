import { Router } from "express";
import setupResponses from "../middlewares/setupResponses.mid.js";
import setupPolicies from "../middlewares/setupPolicies.mid.js";

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
    //Función para Renderizar:
    applyMiddelwaresRender = (middelwaresRender) => middelwaresRender.map(midRend => async(req, res, next) => {
        try {
            await midRend(req, res, next);
        } catch (error) {
            res.status(error.statusCode || 500).render("error", { error });
        }
    });
    
    /* Métodos CRUD */
    //Create:
    create = (path, policies, ...middelwares) => this.router.post(path, setupPolicies(policies), this.applyMiddlewares(middelwares));
    //Read:
    read = (path, policies, ...middelwares) => this.router.get(path, setupPolicies(policies), this.applyMiddlewares(middelwares)); 
    //Update:
    update = (path, policies, ...middelwares) => this.router.put(path, setupPolicies(policies), this.applyMiddlewares(middelwares));
    //Delete:
    destroy = (path, policies, ...middelwares) => this.router.delete(path, setupPolicies(policies), this.applyMiddlewares(middelwares));
    /* Fin de Métodos CRUD */
    //Use:
    use = (path, ...middelwares) => this.router.use(path, this.applyMiddlewares(middelwares));
    //Render:
    render = (path, policies, ...middelwaresRender) => this.router.get(path, setupPolicies(policies), this.applyMiddelwaresRender(middelwaresRender));
};

export default RouterHelper;