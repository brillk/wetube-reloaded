import express from "express";
import {
  edit,
  removeUser,
  logout,
  see,
} from "../controllers/userController.js";

const usersRouter = express.Router(); //라우터 만들기

usersRouter.get("/logout", logout);
usersRouter.get("/edit", edit); //링크를 GET하기
usersRouter.get("/removeUser", removeUser);
usersRouter.get("/:id(\\d+)", see);
export default usersRouter;
