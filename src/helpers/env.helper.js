import { config } from "dotenv";
import argvsHelper from "./argvs.helper.js";

const mode = argvsHelper.mode;
const path = `.env.${mode}`;

config({ path });

const env = {
    PORT: process.env.PORT,
    LINK_MONGODB: process.env.LINK_MONGODB,
    SECRET: process.env.SECRET,
    GOOGLE_ID: process.env.GOOGLE_ID,
    GOOGLE_SECRET_KEY: process.env.GOOGLE_SECRET_KEY
};

export default env; 
