import { isValidObjectId } from "mongoose";
import { usersService, cartsService } from "../services/service.js";
import { compareHash, createHash } from "../helpers/hash.helper.js";
import { sendEmailHelper } from "../helpers/email.helper.js";
import { verifyToken } from "../helpers/token.helper.js";
import resetPasswordHelper from "../helpers/resetPassword.helper.js";

class UsersController {
    constructor() {
        this.uService = usersService;
        this.cService = cartsService;
    }
    createUser = async (req, res) => {
        const data = req.body;
        if (!data || !data.first_name || !data.last_name || !data.email || !data.password || !data.age) {
            res.json400("Missing information!");
        }
        const { email } = data;
        const verifyUser = await this.uService.readByFilter({ email });
        if (verifyUser) { res.json400("User already exists!"); };
        const passHash = createHash(data.password);
        data.password = passHash;
        const response = await this.uService.createOne(data);
        res.json200(response);
    };

    getUser = async (req, res) => {
        const { uid } = req.params;
        if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
        const response = await this.uService.readById(uid).populate("cart");
        if (!response) { res.json404("User not found!"); }
        res.json200(response);
    };

    getUserByFilter = async (req, res) => {
        const { email } = req.params;
        if (!email) { return res.json404("Error get the email!"); }
        const response = await this.uService.readByFilter({ email });
        if (!response) { return res.json404("User not found!"); }
        res.json200(response);
    }

    getAllUsers = async (req, res) => {
        const response = await this.uService.readAll();
        if (response.length === 0) { res.json404(); }
        res.json200(response);
    };

    updateUser = async (req, res) => {
        const { _id } = req.user;
        const data = req.body;
        if (!isValidObjectId(_id)) { res.json400("Invalid user ID!"); }
        if (!data) { res.json400("No data to update"); }
        const verifyUser = await this.uService.readById(_id);
        if (!verifyUser) { res.json404("User not Found!!!"); }
        const response = await this.uService.updateById(_id, data);
        res.json200(response);
    };

    deleteUser = async (req, res) => {
        const { uid } = req.params;
        if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
        const verifyUser = await this.uService.readById(uid);
        if (!verifyUser) { res.json404("User not Found!!!"); }
        const response = await this.uService.destroyById(uid);
        res.json200(response);
    };

    returnCartUser = async (req, res) => {
        const { uid } = req.params;
        if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
        const user = await this.uService.readById(uid);
        if (!user) { res.json400("User not Found!"); }
        const carts = (user.cart || []).filter(cid => cid != null).map(cid => cid.toString());
        if (carts.length === 0) { res.json404(); }
        let activeCart = [];
        for (let i = 0; i < carts.length; i++) {
            const cid = carts[i].toString();
            let cart = await this.cService.readById(cid);
            if (cart.close == false) {
                activeCart = cart;
                break;
            }
        }
        res.json200(activeCart);
    };

    returnAllCartsUser = async (req, res) => {
        const { uid } = req.params;
        const user = await this.uService.readById(uid);
        const carts = user.cart;
        return res.json200(carts);
    };

    asociateCartToUser = async (req, res) => {
        const { uid } = req.params;
        const { cartId } = req.body;
        const user = await this.uService.readById(uid);
        const carts = user.cart;
        carts.push(cartId);
        const response = await this.uService.updateById(uid, { cart: carts });
        res.json200(response);
    };

    sendEmailUser = async (req, res) => {
        const { email } = req.params;
        if (!email) { res.json400("Invalid Email!"); }
        await sendEmailHelper(email);
        res.json200("Email was send!");
    };

    sendEmailPassword = async (req, res) => {
        const { email } = req.params;
        if (!email) { return res.json400("Invalid Email!"); }
        await resetPasswordHelper(email);
        res.json200("Email was send!");
    };

    updateUserPassword = async (req, res) => {
        const { email, token } = req.params;
        const { password } = req.body;
        if (!email || !token) { return res.json400("Verify data!"); }
        //Comparo el token:
        let verify = verifyToken(token);
        if (!verify) { return res.json404("Invalid Token!"); }
        let user = await this.uService.readByFilter({ email });
        if (!user) { return res.json400(); }
        const newPassword = createHash(password);
        const checkPass = compareHash (newPassword, user.password);
        if (checkPass) { return json401("The new password is the same that the old one!"); }
        await this.uService.updateById(user._id, { password: newPassword });
        res.json200("Password update!");
    };
}

const usersController = new UsersController();

export default usersController;