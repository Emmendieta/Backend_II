import { transport } from "./email.helper.js";

const verifyEmail = async (email, verifyCode) => {
    try {
        await transport.sendMail({
            from: process.env.GOOGLE_EMAIL,
            to: email,
            subject: "Verify your email",
            html: `
            <h1> Verify Code: ${verifyCode}</h1>
            <a href="http://localhost:${process.env.PORT}/verify/${email}">Click Here to Verify your Email</a>
            `
        })
    } catch (error) {
        throw error;
    }
};

export default verifyEmail;