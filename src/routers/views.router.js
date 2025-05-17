import { Router } from "express";
import { productsManager } from "../data/managers/mongo/manager.mongo.js";
import { isValidObjectId } from "mongoose";
import passport from "../middlewares/passport.mid.js";

const viewsRouter = Router();

const indexView = async (req, res) => {
    try {
        const products = await productsManager.readAll();
        res.status(200).render("index", { products }); 
        //FALTA ACA DETERMINAR SI NO SE ENCUENTRA NINGUN PRODUCTO!!!!
    } catch (error) {
        res.status(error.statusCode || 500).render("error", { error });
    }
};

const registerView = async (req, res) => {
    try {
        res.status(200).render("register");
    } catch (error) {
        res.status(error.statusCode || 500).render("error", { error });
    }
};

const loginView = async (req, res) => {
    try {
        res.status(200).render("login");
    } catch (error) {
        res.status(error.statusCode || 500).render("error", { error });
    }
};

const detailsView = async (req, res) => {
    try {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            res.status(404).render("error", { error: "Verify id!" });
        };
        const product = await productsManager.readById(pid);
        if(!product) {
            res.status(404).render("error", { error: "Product not found!" });
        }
        res.status(200).render("details", { product }); 
    } catch (error) {
        res.status(error.statusCode || 500).render("error", {error});
    }
};

const profileView = async (req, res) => {
    try {
        const { user } = req;
        res.status(200).render("profile", {user});
    } catch (error) {
        res.status(error.statusCode || 500).render("error", {error});
    }
};

const updateView = async (req, res) => {
    try {
        res.status(200).render("update-user");
    } catch (error) {
        res.status(error.statusCode || 500).render("error", { error });
    }
};

viewsRouter.get("/", indexView);
viewsRouter.get("/register", registerView);
viewsRouter.get("/login", loginView);
viewsRouter.get("/details/:pid", detailsView);
viewsRouter.get("/profile", passport.authenticate("user", {session: false}), profileView);
viewsRouter.get("/update-user", updateView)


export default viewsRouter;