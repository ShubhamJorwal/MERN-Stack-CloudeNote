const mongoose = require("mongoose")


const connectToMongo = async () => {
    const mongoURI = process.env.mongoURI || "mongodb+srv://Shubham_sj:shubhamjorwal123@mclarenecom.qtypoch.mongodb.net/Cloude-Note?retryWrites=true&w=majority"
    try {
        await mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log(`Connected to MongoDB successfully ${mongoURI}`);
    } catch (error) {
        console.error(error);
    }
}



module.exports = connectToMongo