import { Router } from "express";
import { usersManager } from "../../data/managers/mongo/manager.mongo.js";
import { isValidObjectId } from "mongoose";
import { createHash } from "../../helpers/hash.helper.js";

const usersRouter = Router();

const createUser = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const data = req.body;
        if(!data || !data.first_name || !data.last_name || !data.email || !data.password || !data.age) {
            const error = new Error("Missing information!");
            error.status = 400;
            throw error;
        }
        const { email } = data;
        const verifyUser = await usersManager.readByFilter({email});
        if (verifyUser) {
            const error = new Error("User already exists!");
            error.statusCode = 400;
            throw error;
        };
        const passHash = createHash(data.password);
        data.password = passHash;
        const response = await usersManager.createOne(data);
        res.status(200).json({response, method, url});
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const { uid } = req.params;
        if(!isValidObjectId(uid)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }
        const response = await usersManager.readById(uid);
        if(!response) {
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({response, method, url});
    } catch (error) {
        next(error);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const response = await usersManager.readAll();
        if(response.length === 0) { 
            const error = new Error("Not Found!");
            error.statusCode = 404;
            throw error;
        };
        res.status(200).json({response, method, url});
    } catch (error) {
        next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const {uid} = req.params;
        const data = req.body;
        if(!isValidObjectId(uid)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }
        if(!data){
            const error = new Error("No data to update");
            error.statusCode = 400;
            throw error;
        }
        const verifyUser = await usersManager.readById(uid);
        if (!verifyUser) {
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        };
        const response = await usersManager.updateById(uid, data);
        res.status(200).json({response, method, url});
    } catch (error) {
        next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const { method, originalUrl: url } = req;
        const { uid } = req.params; 
        if(!isValidObjectId(uid)) {
            const error = new Error("Invalid user ID");
            error.statusCode = 400;
            throw error;
        }
        const verifyUser = await usersManager.readById(uid);
        if (!verifyUser) {
            const error = new Error("User not found!");
            error.statusCode = 404;
            throw error;
        };
        const response = await usersManager.destroyById(uid);
        res.status(200).json({response, method, url});
    } catch (error) {
        next(error);
    }
};

usersRouter.get("/:uid", getUser);
usersRouter.get("/", getAllUsers);
usersRouter.post("/", createUser);
usersRouter.put("/:uid", updateUser);
usersRouter.delete("/:uid", deleteUser);

export default usersRouter;