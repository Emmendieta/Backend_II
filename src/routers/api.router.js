import productsRouter from "./api/products.router.js";
import cartsRouter from "./api/carts.router.js";
import usersRouter from "./api/users.router.js";
import cookiesRouter from "./api/cookies.router.js";
import authRouter from "./api/auth.router.js";
import RouterHelper from "../helpers/router.helper.js";

class ApiRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    };
    init = () => {
        this.use("/products", productsRouter);
        this.use("/carts", cartsRouter);
        this.use("/users", usersRouter);
        this.use("/cookies", cookiesRouter);
        this.use("/auth", authRouter);
    }
};

const apiRouter = (new ApiRouter()).getRouter();

export default apiRouter;