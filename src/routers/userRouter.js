import express from "express";
import { all } from "express/lib/application";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController.js";

import { pretectorMiddleware, publicOnlyMiddleware } from "../middlewares.js";
const usersRouter = express.Router(); //라우터 만들기

usersRouter.get("/logout", pretectorMiddleware, logout);
usersRouter.route("/edit").all(pretectorMiddleware).get(getEdit).post(postEdit);
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get("/:id", see);

export default usersRouter;
