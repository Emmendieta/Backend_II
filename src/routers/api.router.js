import { Router } from "express";
import productsRouter from "./api/products.router.js";
import cartsRouter from "./api/carts.router.js";
import usersRouter from "./api/users.router.js";
import cookiesRouter from "./api/cookies.router.js";
import authRouter from "./api/auth.router.js";

const apiRouter = Router();

apiRouter.use("/products", productsRouter);
apiRouter.use("/carts", cartsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/cookies", cookiesRouter);
apiRouter.use("/auth", authRouter);

export default apiRouter;