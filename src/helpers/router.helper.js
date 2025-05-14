import { Router } from "express";

class RouterHelper {
    constructor() {
        this.router = Router();
    }
    getRouter = () => this.router;
    
    //Función que aplica todas las lógicas que se repiten:
    applyMiddlewares = (middelwares) => middelwares.map((mid) => async(req, res, next) => {
        try {
            await mid(req, res, next);
        } catch (error) {
            next(error);
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
}

export default RouterHelper;

/* Video 05 - 28:22) ESTO SE APLICA A TODOS LOS ROUTERS y VER SI A ALGO MAS */