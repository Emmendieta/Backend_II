import { transport } from "./email.helper.js";
import { tokenPassword } from "./token.helper.js";
import { join } from "path";
import __dirname from "../../utils.js";

const resetPasswordHelper = async (email) => {
    try {
        //Creo el Token:
        const token = tokenPassword({ email });
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Reset Your Password",
            template: "templateResetPassword",
            context: { restartLink: `http://localhost:${process.env.PORT}/reset/${email}/${token}`},
            attachments: [
                {
                    filename: "verifyImg.jpg",
                    path: join(__dirname, "/public/assets/verifyImg.jpg"),
                    cid: "verifyImg"
                }
            ]
        })
    } catch (error) {
        throw error;
    }
};

export default resetPasswordHelper;