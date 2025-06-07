import { join } from "path";
import { transport } from "./email.helper.js";
import __dirname from "../../utils.js";

const verifyEmail = async (email, verifyCode) => {
    try {
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Verify your email",
            template: "templateVerifyEmail",
            context: {
                verifyCode,
                verifyLink: `http://localhost:${process.env.PORT}/verify/${email}`
            },
            attachments: [
                {
                    filename: "verifyImg.jpg",
                    path: join(__dirname, "/public/assets/verifyImg.jpg"),
                    cid: "verifyImg" //Este valor tiene que conicidir con el cid que esta en la imagen del handlebars
                }
            ]
        })
    } catch (error) {
        throw error;
    }
};

export default verifyEmail;