import express from "express";
import { trending } from "../controllers/videoController";
import { join, login } from "../controllers/userController";

const globalRouter = express.Router(); //라우터 만들기

globalRouter.get("/", trending); //링크를 GET하기
globalRouter.get("/join", join);
globalRouter.get("/login", login);
export default globalRouter;
