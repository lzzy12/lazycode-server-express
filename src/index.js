import express from 'express';
import morgan from 'morgan';
import mongoose from "mongoose";
import ServerConfig from './config/ServerConfig.js';
import problemRouter from './routes/problem.js';
import cors from 'cors'

const app = express();

app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/problems', problemRouter);
// app.use("/api", apiRoutes);
mongoose.set("strictQuery", false);
mongoose.connect(ServerConfig.DB_URL)
    .then(() => {
      console.log('Mongodb Connection successful');
      app.listen(ServerConfig.PORT, () => {
        console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
      })
    })
    .catch(err => {
      console.log(err);
    });