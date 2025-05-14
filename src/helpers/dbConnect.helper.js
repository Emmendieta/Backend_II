import { connect } from "mongoose";

const dbConnect = async (link) => {
    try {
        await connect(link);
        console.log("Connected to MongoDB");
    } catch(error) {
        console.log(error);
    }
};

export default dbConnect;