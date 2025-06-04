import { usersRepository } from "../repositories/repository.js";
import { verifyToken } from "../helpers/token.helper.js";

const setupPolicies = (policies) => async (req, res, next) => {
    try {
        //Si la politica es publica puedo dejar pasar;
        if (policies.includes("PUBLIC")) { return next(); }
        //Ahora si las politicas no son publicas, necesito recuperar el token:
        const token = req?.cookies?.token;
        if (!token) { return res.json401(); }
        //Verifico el Token:
        const data = verifyToken(token);
        const { user_id, email, role } = data;
        if (!user_id || !email || !role) { return res.json401(); }
        const listRoles = {
            USER: policies.includes("USER"),
            ADMIN: policies.includes("ADMIN")
        };
        if (!listRoles[role]) { return res.json401(); }
        const user = await usersRepository.readById(user_id);
        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
};

export default setupPolicies;