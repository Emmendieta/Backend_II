import { createTransport } from "nodemailer";

const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GOOGLE_EMAIL,
        pass: process.env.GOOGLE_PASSWORD
    }
});

//Función de utilidad que va a enviar el correo electronico:

const sendEmailHelper = async (email) => {
    try {
        await transport.sendMail( {
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "MAIL DE PRUEBA",
            html: "<h1> Correo de prueba con Nodemailer </h1>" //Aca poder meter el script con el formato que queres mas estructurado
        });
    } catch (error) {
        throw error;
    }
};

export { sendEmailHelper, transport };