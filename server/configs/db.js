import mongoose, { mongo } from "mongoose";

const connectDB = async () => {
  mongoose.connection.on("connected", () => console.log("Database connected"));
  mongoose.connection.on("error", (err) =>
    console.error("Database error:", err),
  );

  await mongoose.connect(`${process.env.MONGODB_URI}/quickshow`);
};

export default connectDB;
