import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { join } from "path";
import __dirname from "../../utils.js";

const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
    }
});

//Configuración de Handlebars como motor de plantillas:
const handlebarsOpts = {
    viewEngine: {
        extName: ".handlebars",
        partialsDir: join(__dirname, "/src/views"),
        defaultLayout: false
    },
    viewPath: join(__dirname, "/src/views"),
    extName: ".handlebars"
};

transport.use("compile", hbs(handlebarsOpts));

//Función de utilidad que va a enviar el correo electronico:

const sendEmailHelper = async (email) => {
    try {
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Test Email",
            template: "testEmail", //Nombre del archivo handlebars
            attachments: [
                {
                    filename: "verifyImg.jpg",
                    path: join(__dirname, "/public/assets/verifyImg.jpg"),
                    cid: "verifyImg" //Este valor tiene que conicidir con el cid que esta en la imagen del handlebars
                }
            ]
        });
    } catch (error) {
        throw error;
    }
};

export { sendEmailHelper, transport };