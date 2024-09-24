import express from 'express';
import { connect as connectDatabase } from './config/database.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import adminRoutes from './api/v1/routes/admin/index.route.js';
import clientRouter from './api/v1/routes/client/index.route.js';
import cookieParser from 'cookie-parser';
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());


connectDatabase();

app.use(bodyParser.json());
app.use(express.json());
app.use(cookieParser());
//Router api ver 1
adminRoutes(app);
clientRouter(app);

// Khởi động server
app.listen(port, () => {
    console.log(`App đang lắng nghe trên cổng ${port}`);
});
