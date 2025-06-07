import jwt from "jsonwebtoken";

const createToken = (data) => {
    try {
        //aca el primer valor es la info a tokenizar, el segundo es la clave secreta para encriptar y la ulitma es el tiempo que dura la firma
        const token = jwt.sign(data,process.env.SECRET,{ expiresIn: 24*60*60 });
        return token;
    } catch (error) {
        error.statusCode = 401;
        throw error;
    }
};

const verifyToken = (token) => {
    try {
        const data = jwt.verify(token, process.env.SECRET);
        return data;
    } catch (error) {
        error.statusCode = 403;
        throw error;
    }
};

const tokenPassword = (data) => {
    try {
        const token = jwt.sign(data, process.env.SECRET, { expiresIn: 900 }); //900 = 15 minutos
        return token;
    } catch (error) {
        throw error;
    }
}

export { createToken, verifyToken, tokenPassword };