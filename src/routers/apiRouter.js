import express from "express";
import {
  registerView,
  createComment,
  deleteComment,
} from "../controllers/recipeControllers";

const apiRouter = express.Router();

apiRouter.post("/recipes/:id([0-9a-f]{24})/view", registerView);
apiRouter.post("/recipes/:id([0-9a-f]{24})/comment", createComment);
apiRouter.delete("/comment/:id([0-9a-f]{24})", deleteComment);

export default apiRouter;
