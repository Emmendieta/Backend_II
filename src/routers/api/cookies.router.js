import { Router } from "express";
import cookiesController from "../../controllers/cookies.controller.js";

const cookiesRouter = Router();

cookiesRouter.get("/read", cookiesController.readCB);
cookiesRouter.get("/read-signed", cookiesController.readSignedCB);
cookiesRouter.post("/create", cookiesController.createCB);
cookiesRouter.post("/create-signed", cookiesController.createSignedCB);
cookiesRouter.delete("/delete", cookiesController.deleteCB);

export default cookiesRouter;