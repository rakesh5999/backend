import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import morgan from "morgan";
import chatRouter from "./routes/chat.route.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
     origin: ["http://localhost:5173", "http://localhost:5174"],
     credentials: true,
     methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(cookieParser());
app.use(morgan("dev"));


app.use("/api/auth", authRouter);
app.use("/api/chats",chatRouter)

export default app;