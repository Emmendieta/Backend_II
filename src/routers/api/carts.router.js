import RouterHelper from "../../helpers/router.helper.js";

class CartRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {

    };
}

const cartsRouter = (new CartRouter()).getRouter();

export default cartsRouter;