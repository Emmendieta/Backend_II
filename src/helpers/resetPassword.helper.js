import { transport } from "./email.helper.js";
import { tokenPassword } from "./token.helper.js";

const resetPasswordHelper = async (email) => {
    try {
        //Creo el Token:
        const token = tokenPassword({ email });
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Reset Your Password",
            html: `
            <a href="http://localhost:${process.env.PORT}/reset/${email}/${token}">Click here to Reset Your Password</a>
            `,

        })
    } catch (error) {
        throw error;
    }
};

export default resetPasswordHelper;