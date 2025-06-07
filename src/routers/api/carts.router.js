import RouterHelper from "../../helpers/router.helper.js";
import cartsController from "../../controllers/carts.controller.js";

class CartRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/", ["USER", "ADMIN"], cartsController.createOne);
        this.read("/", ["ADMIN"], cartsController.readAll);
        this.read("/:cid", ["USER", "ADMIN"], cartsController.readById);
        this.update("/:cid", ["USER", "ADMIN"], cartsController.updateById);
        this.destroy("/:cid", ["USER", "ADMIN"], cartsController.destroyById);
        this.read("/:cid/products", ["USER", "ADMIN"], cartsController.productsCart);   
        this.update("/finalize/:cid", ["USER", "ADMIN"], cartsController.finalizeCart);
    };
}

const cartsRouter = (new CartRouter()).getRouter();

export default cartsRouter;