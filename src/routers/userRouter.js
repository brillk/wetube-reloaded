import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from "../controllers/userController.js";

const usersRouter = express.Router(); //라우터 만들기

usersRouter.get("/logout", logout);
usersRouter.route("/edit").get(getEdit).post(postEdit);
usersRouter.get("/github/start", startGithubLogin);
usersRouter.get("/github/finish", finishGithubLogin);
usersRouter.get("/:id(\\d+)", see);

export default usersRouter;
