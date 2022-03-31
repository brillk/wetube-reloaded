import express from "express";
import { trending, search } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router(); //라우터 만들기

globalRouter.get("/", trending); //링크를 GET하기
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);
export default globalRouter;
