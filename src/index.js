import express from 'express';
import morgan from 'morgan';
import mongoose from "mongoose";
import ServerConfig from './config/ServerConfig.js';

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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