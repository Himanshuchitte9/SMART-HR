
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

dotenv.config();

console.log('Loaded ENV:', { PORT: process.env.PORT, mongoDBURI: process.env.mongoDBURI, MONGODBURI: process.env.MONGODBURI });

const app = express();
const PORT = process.env.PORT || 5000;
const URI = process.env.mongoDBURI || process.env.MONGODBURI;

// mongo connection + server start
mongoose.connect(URI)
    .then(() => {
        console.log("Connected to MongoDB");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
    });
