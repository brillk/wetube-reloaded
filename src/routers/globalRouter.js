import express from "express";
import { trending, searchVideo } from "../controllers/videoController";
import { join } from "../controllers/userController";
const globalRouter = express.Router(); //라우터 만들기

globalRouter.get("/", trending); //링크를 GET하기
globalRouter.get("/", searchVideo);
globalRouter.get("/join", join);

export default globalRouter;
