import express from "express";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userControllers";
import { home, search } from "../controllers/recipeControllers";
import { publickOnlyMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter
  .route("/join")
  .all(publickOnlyMiddleware)
  .get(getJoin)
  .post(postJoin);
rootRouter
  .route("/login")
  .all(publickOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
