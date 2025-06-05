import passportCB from "../../middlewares/passportCB.mid.js";
import RouterHelper from "../../helpers/router.helper.js";
import authController from "../../controllers/auth.controller.js";

class AuthRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/register", ["PUBLIC"], passportCB("register"), authController.registerCB);
        this.create("/login", ["PUBLIC"], passportCB("login"), authController.loginCB);
        this.create("/signout", ["USER", "ADMIN"], authController.signOutCB);
        this.create("/current", ["USER", "ADMIN"], authController.currentCB);
        this.create("/online", ["USER", "ADMIN"], authController.currentCB);
        this.read("/bad-auth", ["PUBLIC"], authController.badAuthCB);
        this.read("/forbidden", ["PUBLIC"], authController.forbiddenCB);
        /*Google*/
        this.read("/google",["PUBLIC"],passportCB("google", { scope: ["email", "profile"] }));
        this.read("/google/redirect", ["PUBLIC"], passportCB("google"), authController.loginCBGoogle);
        /*Email*/
        this.read("/verify/:email/:verifyCode", ["PUBLIC"], authController.verifyUserCB);
    };
};

const authRouter = (new AuthRouter()).getRouter();

export default authRouter;