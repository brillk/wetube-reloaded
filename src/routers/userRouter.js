import express from "express";
import {
  getEdit,
  postEdit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController.js";

import {
  protectorMiddleware,
  publicOnlyMiddleware,
  videoUpload,
} from "../middlewares.js";
const usersRouter = express.Router(); //라우터 만들기

usersRouter.get("/logout", protectorMiddleware, logout);
usersRouter
  .route("/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(videoUpload.single("avatar"), postEdit); //avatar이름을 가진 input의 파일을 가지고 와서 uploads로 저장 한다
usersRouter
  .route("/change-password")
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
usersRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
usersRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
usersRouter.get("/:id", see);

export default usersRouter;
