import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/transactions", transactionRoutes);
app.use("/api/budget", budgetRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;

if (process.env.NODE_ENV !== "production") {
	const PORT = process.env.PORT || 5000;
	app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}
