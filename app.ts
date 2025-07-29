import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import authRoute from "./src/routes/auth";
import taskRoute from "./src/routes/task";
import roleRoute from "./src/routes/role";
import userRoute from "./src/routes/user";
import sequelize from "./src/config/db";

dotenv.config();

const app = express();
app.disable("x-powered-by");
app.use(helmet());

const allowedOrigins = ["http://localhost:5173", "https://productionmp.com"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use((req, res, next) => {
  if (
    process.env.NODE_ENV === "production" &&
    req.headers["x-forwarded-proto"] !== "https"
  ) {
    return res.redirect("https://" + req.headers.host + req.url);
  }
  next();
});

app.use("/api/auth/v1", authRoute);
app.use("/api/task", taskRoute);
app.use("/api/role", roleRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("Database connected and models!");
    app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`));
  })
  .catch((err) => {
    console.error("Failed connected to db :", err);
  });
