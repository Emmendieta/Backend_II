import { response, Router } from "express";
import passport from "../../middlewares/passport.mid.js";
import { usersManager } from "../../data/managers/mongo/manager.mongo.js";
import { compareHash, createHash } from "../../helpers/hash.helper.js";


const authRouter = Router();

const registerCB = async (req, res, next) => {
    try {
        const { method, originalUrl: url} = req;
        //const { _id } = req.user;

        /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/

        if(!req.body.email || !req.body.password || !req.body.age) {
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

        return res.status(201).json( {message: "Registered!", response: newUser, method, url });
    } catch (error) {
        next(error);
    }
};

const loginCB = async (req, res, next) => {
    try {
        const { method, originalUrl: url} = req;

        /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/
        const { email, password } = req.body;
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
        }
        //req.session.user_id = user._id;
        //req.session.email = user.email;
        //req.session.role = user.role;

        return res.status(200).json( {message: "Logged in successful!", response: user._id, method, url });

        /* FIN DE LA PARTE DEL VIDEO 2 */

        //return res.status(200).cookie("token", req.user.token, { maxAge: 24*60*60*1000}).json( {message: "Logged in successful!", response: _id, method, url });
    } catch (error) {
        next(error);
    }
};

const signOutCB = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;

                /* ESTA PARTE VER SI HAY QUE MODIFICARLA YA QUE ES DEL VIDEO 2*/
        console.log(req.session);
        req.session.destroy();
        console.log(req.session);

        return res.status(200).json( {message: "Sign Out successful!", method, url });

        /* FIN DE LA PARTE DEL VIDEO 2 */



        //return res.status(200).clearCookie("token").json({ message: "Sign out successful!", method, url });
    } catch (error) {
        next(error);
    }
}

const badAuthCB = (req, res, next) => {
    try {
        const error = new Error("Bad auth!");
        error.statusCode = 401;
        throw error;
    } catch (error) {
        next(error);
    }
};

const forbiddenCB = (req, res, next) => {
    try {
        const error = new Error("Forbidden!");
        error.statusCode = 403;
        throw error;
    } catch (error) {
        next(error);
    }
};

const badOpts = { session: false, failureRedirect: "api/auth/bad-auth" };
const forbiddenOpts = { session: false, failureRedirect: "api/aut/forbidden"}

authRouter.post("/register", registerCB);
//authRouter.post("/register", passport.authenticate("register", badOpts) ,registerCB);
authRouter.post("/login", loginCB);
//authRouter.post("/login", passport.authenticate("login", badOpts) ,loginCB);
authRouter.post("/signout", signOutCB);
//authRouter.post("/signout", passport.authenticate("current", forbiddenOpts), signOutCB);
authRouter.get("/bad-auth", badAuthCB);
authRouter.get("/forbidden", forbiddenCB);  

export default authRouter;