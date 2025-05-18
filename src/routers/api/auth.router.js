import { usersManager } from "../../data/managers/mongo/manager.mongo.js";
import { createHash } from "../../helpers/hash.helper.js";
import passportCB from "../../middlewares/passportCB.mid.js";
import RouterHelper from "../../helpers/router.helper.js";

const registerCB = async (req, res) => {
    const { _id } = req.user;
    if (!req.body.email || !req.body.password || !req.body.age) { res.json401("Invalid Data!"); };
    const { email } = req.body;
    const user = await usersManager.readByFilter({ email });
    if (user) { res.json403("User already exists!"); };
    req.body.password = createHash(req.body.password);
    const newUser = await usersManager.createOne(req.body);
    res.json201(_id, "Registered!");
};

const loginCB = async (req, res) => {
    const { _id } = req.user;
    const opts = { maxAge: 24 * 60 * 60 * 1000 };
    res.cookie("token", req.user.token, opts).json200(_id, "Logged In Success!!!");
};

const signOutCB = async (req, res) => res.clearCookie("token").json200(req.user._id, "Sign out successful!");

const badAuthCB = (req, res) => res.json401();

const forbiddenCB = (req, res) => res.json403();

const currentCB = async (req, res) => res.json200(true, "User is Online!")  

/* const badOpts = { session: false, failureRedirect: "/api/auth/bad-auth" };
const forbiddenOpts = { session: false, failureRedirect: "/api/auth/forbidden"} */

class AuthRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/register", ["PUBLIC"], passportCB("register"), registerCB);
        this.create("/login", ["PUBLIC"], passportCB("login"), loginCB);
        this.create("/signout", ["USER", "ADMIN"], signOutCB);
        this.create("/current", ["USER", "ADMIN"], currentCB);
        this.read("/bad-auth", ["PUBLIC"], badAuthCB);
        this.read("/forbidden", ["PUBLIC"], forbiddenCB);
        /*Google*/
        //ESTA LINEA DE ABAJO TIENE QUE SER CON UN POST Y UN BOTON EN REALIDAD:
        this.read("/google", ["PUBLIC"], passportCB("google", { scope: ["email", "profile"] }));
        this.read("/google/redirect", ["PUBLIC"], passportCB("google"), loginCB);
    };
};

const authRouter = (new AuthRouter()).getRouter();

export default authRouter;