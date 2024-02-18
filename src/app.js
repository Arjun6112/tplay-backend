import express from "express";
import morgan from "morgan";
import statusMonitor from 'express-status-monitor';
import router from "./route.js";
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cors());
app.use(statusMonitor());
app.setMaxListeners(100);
app.use('/', router);

export default app;
