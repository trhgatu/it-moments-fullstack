import express from 'express';
import { connect as connectDatabase } from './config/database.js';
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

app.use(cors({
    /* origin: 'https://it-moments.vercel.app', */
    origin: 'http://localhost:5173',
    credentials: true
}));


connectDatabase();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
//Cấu hình prefixadmin
app.locals.prefixAdmin = prefixAdmin;
//Router api ver 1
adminRoutes(app);
clientRouter(app);

// Khởi động server
app.listen(port, () => {
    console.log(`App đang lắng nghe trên cổng ${port}`);
});
