import mongoose from "mongoose";

async function connect() {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('DB Connected')
    } catch (error) {
        console.log('Error while connecting to DB', error)
    }
}

export default connect;