import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleterecipe,
} from "../controllers/recipeControllers";
import { protectorMiddleware, recipeUpload } from "../middlewares";
const recipeRouter = express.Router();

recipeRouter.get("/:id([0-9a-f]{24})", watch);
recipeRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
recipeRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleterecipe);
recipeRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(
    recipeUpload.fields([
      { name: "recipe", maxCount: 10 },
      { name: "thumb", maxCount: 1 },
    ]),
    postUpload
  );

export default recipeRouter;
