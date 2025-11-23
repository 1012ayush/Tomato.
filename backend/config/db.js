import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://ayushkatiyar_tomato:ilRlJMQnFYbMWcNv@cluster0.ipsn3x3.mongodb.net/food-del').then(()=>console.log("DB Connected"))
}