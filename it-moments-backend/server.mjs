import express from 'express';
import { connect as connectDatabase } from './config/database.js';
import './cron/cronJobs.js';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import adminRoutes from './api/v1/routes/admin/index.route.js';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';
import { prefixAdmin } from './config/system.js';
import jwt from 'jsonwebtoken';  // Thêm jwt để xác thực token nếu cần

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const httpServer = http.createServer(app);
const io = new Server(httpServer, {
    /* cors: {
        origin: 'https://it-moments-frontend.vercel.app',
        methods: ['GET', 'POST'],
        credentials: true,
    }, */
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});
export const usersSocket = {};
const startServer = async () => {
    try {
        // Kết nối với database
        await connectDatabase(); // Kết nối bất đồng bộ

        // Khởi động cron job sau khi kết nối thành công
        console.log('Kết nối MongoDB thành công');

        // Cấu hình middlewares
        /* app.use(cors({
            origin: 'https://it-moments-frontend.vercel.app',
            credentials: true,
        })); */
        app.use(cors({
            origin: 'http://localhost:5173',
            credentials: true,
        }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());  // Đảm bảo cookieParser được sử dụng

        // Cấu hình prefixAdmin
        app.locals.prefixAdmin = prefixAdmin;

        // Cấu hình Router API
        adminRoutes(app);
        clientRouter(app);

        // Khởi động server sau khi kết nối thành công
        httpServer.listen(port, () => {
            console.log(`App đang lắng nghe trên cổng ${port}`);
        });



        io.on('connection', (socket) => {
            console.log('User connected: ' + socket.id);

            socket.on('register', (token) => {
                try {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const userId = decoded.id;

                    if(!userId) {
                        console.error('Không tìm thấy userId trong token');
                        return;
                    }

                    if(!usersSocket[userId]) {
                        usersSocket[userId] = [];
                    }

                    // Lưu socket.id mới
                    usersSocket[userId].push(socket.id);
                    console.log(`User ${userId} connected with socket ID ${socket.id}`);
                } catch(error) {
                    console.error('Lỗi xác thực token:', error);
                }
            });

            socket.on('disconnect', () => {
                for(const userId in usersSocket) {
                    usersSocket[userId] = usersSocket[userId].filter(id => id !== socket.id);
                    if(usersSocket[userId].length === 0) {
                        delete usersSocket[userId];
                    }
                }
                console.log('User disconnected: ' + socket.id);
            });
        });
    } catch(error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};

export { io };
startServer();
