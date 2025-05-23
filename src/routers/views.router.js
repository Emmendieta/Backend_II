import { cartsManager, productsManager } from "../data/managers/mongo/manager.mongo.js";
import { isValidObjectId } from "mongoose";
import RouterHelper from "../helpers/router.helper.js";

const indexView = async (req, res) => {
        const products = await productsManager.readAll();
        if (products.length === 0) { res.json404("Not Products avalible!").render("error"); }
        const user = req.user || null;
        res.status(200).render("index", { products, isAdmin: user?.role === "ADMIN" });
};

/* User View */

const registerView = async (req, res) => {
        res.status(200).render("register");
};

const loginView = async (req, res) => {
        res.status(200).render("login");
};

const detailsView = async (req, res) => {
        const { pid } = req.params;
        if (!isValidObjectId(pid)) {
                res.status(404).render("error", { error: "Verify id!" });
        };
        const product = await productsManager.readById(pid);
        if (!product) {
                res.status(404).render("error", { error: "Product not found!" });
        }
        res.status(200).render("details", { product });
};

const profileView = async (req, res) => {
        const { user } = req;
        res.status(200).render("profile", { user });
};

const updateView = async (req, res) => {
        res.status(200).render("update-user");
};

/* Products Views */

const newProductView = async (req, res) => {
        res.status(200).render("product", {product: null});
};

const editProductView = async (req, res) => {
        const { pid } = req.params;
        if(!isValidObjectId(pid)) { return res.status(500).render("error", { error: "Product not found!" }); }
        const product = await productsManager.readById(pid);
        if(!product) return res.status(404).render("error");
        res.status(200).render("product", {product});
};

/* Carts View */

const userCartsView = async (req, res) => {
        const { user } = req;
        let carts;
        if(user.cart.length === 0) { carts = cartsManager.createOne(); } 
        else { carts = user.cart }
        res.status(200).render("carts", {carts})
};

class ViewsRouter extends RouterHelper {
        constructor() {
                super();
                this.init();
        };
        init = () => {
                this.render("/", ["PUBLIC"], indexView);
                this.render("/register", ["PUBLIC"], registerView);
                this.render("/login", ["PUBLIC"], loginView);
                this.render("/details/:pid", ["PUBLIC"], detailsView);
                this.render("/profile", ["USER", "ADMIN"], profileView);
                this.render("/update-user", ["USER", "ADMIN"], updateView);
                this.render("/products/create", ["ADMIN"], newProductView);
                this.render("/products/edit/:pid", ["ADMIN"], editProductView);      
                this.render("/carts", ["USER", "ADMIN"], userCartsView);
        };
};

const viewsRouter = (new ViewsRouter()).getRouter();

export default viewsRouter;