import RouterHelper from "../helpers/router.helper.js";
import viewsController from "../controllers/views.controller.js";

class ViewsRouter extends RouterHelper {
        constructor() {
                super();
                this.init();
        };
        init = () => {
                this.render("/", ["PUBLIC"], viewsController.indexView);
                this.render("/register", ["PUBLIC"], viewsController.registerView);
                this.render("/login", ["PUBLIC"], viewsController.loginView);
                this.render("/details/:pid", ["PUBLIC"], viewsController.detailsView);
                this.render("/profile", ["USER", "ADMIN"], viewsController.profileView);
                this.render("/update-user", ["USER", "ADMIN"], viewsController.updateView);
                this.render("/products/create", ["ADMIN"], viewsController.newProductView);
                this.render("/products/edit/:pid", ["ADMIN"], viewsController.editProductView);
                this.render("/carts", ["USER", "ADMIN"], viewsController.userCartsView);
                //Email:
                this.render("/verify/:email", ["PUBLIC"], viewsController.verifyView);
                this.render("/reset/:email/:token", ["PUBLIC"], viewsController.resetView);
        };
};

const viewsRouter = (new ViewsRouter()).getRouter();

export default viewsRouter;