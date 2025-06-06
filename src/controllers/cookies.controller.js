class CookiesController {
    readCB = (req, res, next) => {
        try {
            const cookies = req.cookies;
            return res.status(200).json({ cookies });
        } catch (error) {
            next(error);
        }
    };

    readSignedCB = (req, res, next) => {
        try {
            const cookies = req.signedCookies;
            return res.status(200).json({ cookies });
        } catch (error) {
            next(error);
        }
    };

    createCB = (req, res, next) => {
        try {
            const maxAge = 1 * 24 * 60 * 60 * 1000;
            const message = "Cookie vence en un día!";
            return res.status(201).cookie("mode", "dark", { maxAge }).cookie("role", "admin", { maxAge }).json({ message });
        } catch (error) {
            next(error);
        }
    };

    createSignedCB = (req, res, next) => {
        try {
            const maxAge = 1 * 24 * 60 * 60 * 1000;
            const message = "Cookie vence en un día!";
            return res.status(201).cookie("user", "alguien", { maxAge, signed: true }).cookie("id", "unaContraseña", { maxAge, signed: true }).json({ message });
        } catch (error) {
            next(error);
        }
    };

    deleteCB = (req, res, next) => {
        try {
            const message = "Cookie eliminada correctamente!";
            return res.status(200).clearCookie("user").clearCookie("role").json({ message });
        } catch (error) {
            next(error);
        }
    };
}

const cookiesController = new CookiesController();

export default cookiesController;