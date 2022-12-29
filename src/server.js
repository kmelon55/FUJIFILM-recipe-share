import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import globalRouter from "./routers/rootRouter";
import recipeRouter from "./routers/recipeRouter";
import userRouter from "./routers/userRouter";
import apiRouter from "./routers/apiRouter";
import { localMiddleware } from "./middlewares";

const app = express();
const logger = morgan("dev");

app.get("/favicon.ico", (req, res) => {
  res.sendStatus(204);
});
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());

app.use(localMiddleware);

app.use("/", globalRouter);
app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("assets"));
app.use("/recipes", recipeRouter);
app.use("/users", userRouter);
app.use("/api", apiRouter);

export default app;
