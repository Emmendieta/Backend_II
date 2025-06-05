import { usersService } from "../services/service.js";

class AuthController {
    registerCB = async (req, res) => {
        const { _id } = req.user;
        res.json201(_id, "Registered!");
    };

    loginCB = async (req, res) => {
        const { _id } = req.user;
        const opts = { maxAge: 24 * 60 * 60 * 1000 };
        res.cookie("token", req.user.token, opts).json200(_id, "Logged In Success!!!");
    };

    loginCBGoogle = async (req, res) => {
        const { _id } = req.user;
        const opts = { maxAge: 24 * 60 * 60 * 1000 };
        res.cookie("token", req.user.token, opts).redirect("/");
    };

    signOutCB = async (req, res) => res.clearCookie("token").json200(req.user._id, "Sign out successful!");

    badAuthCB = (req, res) => res.json401();

    forbiddenCB = (req, res) => res.json403();

    currentCB = async (req, res) => res.json200(req.user, "User is online!!!");

    /*Email*/

    verifyUserCB = async (req, res) => {
        const { email, verifyCode } = req.params;
        let user = await usersService.readByFilter({ email, verifyCode });
        if(!user) { return res.json404() };
        user = await usersService.updateById(user._id, { isVerified: true });
        res.json200(user, `Email: ${user.email} has been verified!`);
    };
}

const authController = new AuthController();

export default authController;