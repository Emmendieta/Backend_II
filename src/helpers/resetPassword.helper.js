import { transport } from "./email.helper.js";

const resetPasswordHelper = async (email) => {
    try {
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Reset Your Password",
            html: `
            <a href="http://localhost:${process.env.PORT}/reset/${email}">Click here to Reset Your Password</a>
            `,
            
        })
    } catch (error) {
        throw error;
    }
};

export default resetPasswordHelper;