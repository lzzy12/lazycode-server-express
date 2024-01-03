import express from 'express';
import morgan from 'morgan';
import mongoose from "mongoose";
import ServerConfig from './config/ServerConfig.js';
import problemRouter from './routes/problem.js';
import cors from 'cors'
import redisClient from './config/redis.js'

const app = express();

app.use(cors())
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/problems', problemRouter);

// app.use("/api", apiRoutes);

mongoose.set("strictQuery", false);
try{
  await Promise.resolve([mongoose.connect(ServerConfig.DB_URL), redisClient.connect()]);
  console.log('Mongodb Connection successful');
  app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
  });
} catch(e){
  console.log(err);
}
  
