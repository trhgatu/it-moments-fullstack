import mongoose from 'mongoose';

export const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("Kết nối thành công");
    } catch (error) {
        console.log("Kết nối thất bại");
    }
};
