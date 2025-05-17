import { response, Router } from "express";
//import passport from "../../middlewares/passport.mid.js";
import { usersManager } from "../../data/managers/mongo/manager.mongo.js";
import { compareHash, createHash } from "../../helpers/hash.helper.js";
import passportCB from "../../middlewares/passportCB.mid.js";
import RouterHelper from "../../helpers/router.helper.js";

const registerCB = async (req, res) => {
    const { method, originalUrl: url } = req;
    //const { _id } = req.user;

    /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/

    if (!req.body.email || !req.body.password || !req.body.age) {
        const error = new Error("Invalid data!");
        error.statusCode = 400;
        throw error;
    };
    const { email } = req.body;
    const user = await usersManager.readByFilter({ email });
    if (user) {
        const error = new Error("User already exists!");
        error.statusCode = 401;
        throw error;
    };
    req.body.password = createHash(req.body.password);
    const newUser = await usersManager.createOne(req.body);


    /* FIN DE LA PARTE DEL VIDEO 2 */

    return res.status(201).json({ message: "Registered!", response: newUser, method, url });
};

const loginCB = async (req, res) => {
    const { method, originalUrl: url } = req;

    /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/
    /*         const { email, password } = req.body;
            if(!email || !password) {
                const error = new Error("Invalid Credentials!");
                error.statusCode = 400;
                throw error;
            };
            const user = await usersManager.readByFilter({ email });
            if (!user) {
                const error = new Error("Invalid Credentials!");
                error.statusCode = 401;
                throw error;
            };
            const verifyPassword = compareHash(password, user.password);
            if (!verifyPassword) {
                const error = new Error("Invalid Credentials!");
                error.statusCode = 401;
                throw error;
            } */
    //req.session.user_id = user._id;
    //req.session.email = user.email;
    //req.session.role = user.role;

    //return res.status(200).json( {message: "Logged in successful!", response: user._id, method, url });

    /* FIN DE LA PARTE DEL VIDEO 2 */
    const { _id } = req.user;
    const opts = { maxAge: 24 * 60 * 60 * 1000 };
    return res.status(200).cookie("token", req.user.token, opts).json({ message: "Logged in successful!", response: _id, method, url });
};

const signOutCB = async (req, res) => {
    const { method, originalUrl: url } = req;

    /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/
    /*         console.log(req.session);
            req.session.destroy();
            console.log(req.session); */

    //return res.status(200).json( {message: "Sign Out successful!", method, url });

    /* FIN DE LA PARTE DEL VIDEO 2 */



    return res.status(200).clearCookie("token").json({ message: "Sign out successful!", method, url });
}

const badAuthCB = (req, res) => {
    const error = new Error("Bad auth!");
    error.statusCode = 401;
    throw error;
};

const forbiddenCB = (req, res) => {
    const error = new Error("Forbidden!");
    error.statusCode = 403;
    throw error;
};

const currentCB = async (req, res) => {
    const { method, originalUrl: url } = req;

    /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/
    /*         const { email } = req.body;
            if(!email) {
                const error = new Error("Invalid Credentials!");
                error.statusCode = 400;
                throw error;
            };
            const user = await usersManager.readByFilter({ email });
            if (!user) {
                const error = new Error("Invalid Credentials!");
                error.statusCode = 401;
                throw error;
            }; */
    //req.session.user_id = user._id;
    //req.session.email = user.email;
    //req.session.role = user.role;

    return res.status(200).json({ message: "User is Online!", response: true, method, url });
};

/* const googleCB = (req, res, next) => {
    try {
        
    } catch (error) {
        next(error);
    }
}; */

/* const badOpts = { session: false, failureRedirect: "/api/auth/bad-auth" };
const forbiddenOpts = { session: false, failureRedirect: "/api/auth/forbidden"} */

class AuthRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.create("/register", passportCB("register"), registerCB);
        this.create("/login", passportCB("login"), loginCB);
        this.create("/signout", passportCB("user"), signOutCB);
        this.create("/current", passportCB("current"), currentCB);
        this.read("/bad-auth", badAuthCB);
        this.read("/forbidden", forbiddenCB);
        /*Google*/
        //ESTA LINEA DE ABAJO TIENE QUE SER CON UN POST Y UN BOTON EN REALIDAD:
        this.read("/google", passportCB("google", { scope: ["email", "profile"] }));
        this.read("/google/redirect", passportCB("google"), loginCB);
    };
};

const authRouter = (new AuthRouter()).getRouter();

export default authRouter;