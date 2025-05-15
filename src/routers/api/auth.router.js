import { response, Router } from "express";
import passport from "../../middlewares/passport.mid.js";

const authRouter = Router();

const registerCB = async (req, res, next) => {
    try {
        const { method, originalUrl: url} = req;
        const { _id } = req.user;

        return res.status(201).json( {message: "Registered!", response: _id, method, url });
    } catch (error) {
        next(error);
    }
};

const loginCB = async (req, res, next) => {
    try {
        const { method, originalUrl: url} = req;
        const { _id } = req.user;
        return res.status(200).cookie("token", req.user.token, { maxAge: 24*60*60*1000}).json( {message: "Logged in successful!", response: _id, method, url });
    } catch (error) {
        next(error);
    }
};

const signOutCB = (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;

        return res.status(200).clearCookie("token").json({ message: "Sign out successful!", method, url });
    } catch (error) {
        next(error);
    }
}

const badAuth = (req, res, next) => {
    try {
        const error = new Error("Bad auth!");
        error.statusCode = 401;
        throw error;
    } catch (error) {
        next(error);
    }
};

const forbidden = (req, res, next) => {
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

authRouter.post("/register", passport.authenticate("register", badOpts) ,registerCB);
authRouter.post("/login", passport.authenticate("login", badOpts) ,loginCB);
authRouter.post("/signout", passport.authenticate("current", forbiddenOpts), signOutCB);
authRouter.get("/bad-auth", badAuth);
authRouter.get("/forbidden", forbidden);  

export default authRouter;