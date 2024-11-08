import express from 'express';
import { connect as connectDatabase } from './config/database.js';
import './cron/cronJobs.js'; // Đảm bảo cron jobs đã được cấu hình trước
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import adminRoutes from './api/v1/routes/admin/index.route.js';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';
import { prefixAdmin } from './config/system.js';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const startServer = async () => {
    try {
        // Kết nối với database
        await connectDatabase(); // Kết nối bất đồng bộ

        // Khởi động cron job sau khi kết nối thành công
        console.log('Kết nối MongoDB thành công');

        // Cấu hình middlewares
        app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
        }));

        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());

        // Cấu hình prefixAdmin
        app.locals.prefixAdmin = prefixAdmin;

        // Cấu hình Router API
        adminRoutes(app);
        clientRouter(app);

        // Khởi động server sau khi kết nối thành công
        app.listen(port, () => {
            console.log(`App đang lắng nghe trên cổng ${port}`);
        });

    } catch (error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};
startServer();
