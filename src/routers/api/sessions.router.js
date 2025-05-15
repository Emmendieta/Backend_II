/* En Teoria este es para probar unicamente sessions */

import { Router } from "express";

const sessionsRouter = Router();

sessionsRouter.post("/create", (req, res, next) => {
    try{

    } catch(error) {
        next(error);
    }
});