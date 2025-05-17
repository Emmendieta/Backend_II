import { Router } from "express";
import { usersManager } from "../../data/managers/mongo/manager.mongo.js";
import { isValidObjectId } from "mongoose";
import { createHash } from "../../helpers/hash.helper.js";
import RouterHelper from "../../helpers/router.helper.js";

const createUser = async (req, res) => {
    const data = req.body;
    if (!data || !data.first_name || !data.last_name || !data.email || !data.password || !data.age) {
        res.json400("Missing information!");
    }
    const { email } = data;
    const verifyUser = await usersManager.readByFilter({ email });
    if (verifyUser) { res.json400("User already exists!"); };
    const passHash = createHash(data.password);
    data.password = passHash;
    const response = await usersManager.createOne(data);
    res.json200(response);
};

const getUser = async (req, res) => {
    const { uid } = req.params;
    if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
    const response = await usersManager.readById(uid);
    if (!response) { res.json404("User not found!"); }
    res.json200(response);
};

const getAllUsers = async (req, res) => {
    const response = await usersManager.readAll();
    if (response.length === 0) { res.json404(); }
    res.json200(response);
};

const updateUser = async (req, res) => {
    const { uid } = req.params;
    const data = req.body;
    if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
    if (!data) { res.json400("No data to update"); }
    const verifyUser = await usersManager.readById(uid);
    if (!verifyUser) { res.json404("User not Found!!!"); }
    const response = await usersManager.updateById(uid, data);
    res.json200(response);
};

const deleteUser = async (req, res) => {
    const { uid } = req.params;
    if (!isValidObjectId(uid)) { res.json400("Invalid user ID!"); }
    const verifyUser = await usersManager.readById(uid);
    if (!verifyUser) { res.json404("User not Found!!!"); }
    const response = await usersManager.destroyById(uid);
    res.json200(response);
};

class UserRouter extends RouterHelper {
    constructor() {
        super();
        this.init();
    }
    init = () => {
        this.read("/:uid", ["USER", "ADMIN"], getUser);
        this.read("/", ["ADMIN"], getAllUsers);
        this.create("/", ["PUBLIC"], createUser);
        this.update("/:uid", ["USER", "ADMIN"], updateUser);
        this.destroy("/:uid", ["ADMIN"], deleteUser);
    }
}

const usersRouter = (new UserRouter()).getRouter();

export default usersRouter;