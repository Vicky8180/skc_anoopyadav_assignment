import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const allowedOrigins = [
    "http://localhost:3000",
  "http://skc-anoopyadav-assignment.vercel.app"
  
  ];
  
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS,PATCH"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
