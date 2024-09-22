import express from 'express';
import { connect as connectDatabase } from './config/database.js';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import setupRoutes from './api/v1/routes/index.route.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());


connectDatabase();

app.use(bodyParser.json());

//Router api ver 1
setupRoutes(app);

// Khởi động server
app.listen(port, () => {
    console.log(`App đang lắng nghe trên cổng ${port}`);
});
