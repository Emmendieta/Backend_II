import { isValidObjectId } from "mongoose";
import productsService from "../services/products.service.js";
import cartsService from "../services/carts.service.js";

class ViewsController {
    constructor() {
        this.pService = productsService;
        this.cService = cartsService;
    }
    indexView = async (req, res) => {
        const products = await this.pService.readAll();
        if (products.length === 0) { res.json404("Not Products avalible!").render("error"); }
        const user = req.user || null;
        res.status(200).render("index", { products, isAdmin: user?.role === "ADMIN" });
    };

    /* User View */

    registerView = async (req, res) => {
        res.status(200).render("register");
    };

    loginView = async (req, res) => {
        res.status(200).render("login");
    };

    detailsView = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
            res.status(404).render("error", { error: "Verify id!" });
        };
        const product = await this.pService.readById(pid);
        if (!product) {
            res.status(404).render("error", { error: "Product not found!" });
        }
        res.status(200).render("details", { product });
    };

    profileView = async (req, res) => {
        const { user } = req;
        res.status(200).render("profile", { user });
    };

    updateView = async (req, res) => {
        res.status(200).render("update-user");
    };

    /* Products Views */

    newProductView = async (req, res) => {
        res.status(200).render("product", { product: null });
    };

    editProductView = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) { return res.status(500).render("error", { error: "Product not found!" }); }
        const product = await this.pService.readById(pid);
        if (!product) return res.status(404).render("error");
        res.status(200).render("product", { product });
    };

    /* Carts View */

    userCartsView = async (req, res) => {
        const { user } = req;
        let carts;
        if (user.cart.length === 0) { carts = this.cService.createOne(); }
        else { carts = user.cart }
        res.status(200).render("carts", { carts })
    };
}

const viewsController = new ViewsController();


export default viewsController;