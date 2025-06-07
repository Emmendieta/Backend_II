import RouterHelper from "../../helpers/router.helper.js";
import productsController from "../../controllers/products.controller.js";

class ProductsRotuer extends RouterHelper {
        constructor() {
                super();
                this.init();
        }
        init = () => {
                this.create("/", ["ADMIN"], productsController.createOne);
                this.read("/", ["PUBLIC"], productsController.readAll);
                this.read("/:pid", ["PUBLIC"], productsController.readById);
                this.update("/:pid", ["ADMIN"], productsController.updateById);
                this.destroy("/:pid", ["ADMIN"], productsController.destroyById);
        }
};

const productsRouter = (new ProductsRotuer()).getRouter();
export default productsRouter;