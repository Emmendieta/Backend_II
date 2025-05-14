import EXPRESS from "express";
import "dotenv/config.js";
import { engine } from "express-handlebars";
import __dirname from "./utils.js";
import morgan from "morgan";
import pathHandler from "./src/middlewares/pathHandler.mid.js";
import errorHandler from "./src/middlewares/errorHandler.mid.js";
import indexRouter from "./src/routers/index.router.js";
import dbConnect from "./src/helpers/dbConnect.helper.js";
import cookieParser from "cookie-parser";

/* Server Settings*/

const SERVER = EXPRESS();
const PORT = process.env.PORT || 8080;
const ready = async () => {
    await dbConnect(process.env.LINK_MONGODB);
    console.log(`Server ready on port ${PORT}`);
}
SERVER.listen(PORT, ready)

/* Engine Settings */

SERVER.engine("handlebars", engine());
SERVER.set("view engine", "handlebars");
SERVER.set("views", __dirname + "/src/views"); 


/* Middlewares Settings */

SERVER.use(cookieParser(process.env.SECRET));
SERVER.use(EXPRESS.json());
SERVER.use(EXPRESS.urlencoded( { extended: true } ));
SERVER.use(EXPRESS.static("public"));
SERVER.use(morgan("dev"));


/* Router Settings */

SERVER.use("/", indexRouter);
SERVER.use(errorHandler);
SERVER.use(pathHandler);



/* Video 01 -- Empieza en FALTA VER CUANDO EMPIEZA */

/* Video 02 -- Empieza en 19:52 */
//Continuar viendo en 43:50

/* Video 05 -- Empieza en 18:30 */