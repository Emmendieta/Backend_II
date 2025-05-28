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
}

const authController = new AuthController();

export default authController;