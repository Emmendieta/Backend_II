import RouterHelper from "../../helpers/router.helper.js";
import usersController from "../../controllers/users.controller.js";

class UserRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read("/:uid", ["USER", "ADMIN"], usersController.getUser);
        this.read("/", ["ADMIN"], usersController.getAllUsers);
        this.create("/", ["PUBLIC"], usersController.createUser);
        this.update("/:uid", ["USER", "ADMIN"], usersController.updateUser);
        this.destroy("/:uid", ["ADMIN"], usersController.deleteUser);
        this.read("/:uid/cart", ["USER", "ADMIN"], usersController.returnCartUser);
        this.update("/:uid/cart", ["USER", "ADMIN"], usersController.asociateCartToUser);
        this.read("/:uid/carts", ["USER", "ADMIN"], usersController.returnAllCartsUser);
    };
}

const usersRouter = (new UserRouter()).getRouter();

export default usersRouter;