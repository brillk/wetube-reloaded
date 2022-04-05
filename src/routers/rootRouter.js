import express from "express";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, login } from "../controllers/userController";

const rootRouter = express.Router(); //라우터 만들기

rootRouter.get("/", home); //링크를 GET하기
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);
export default rootRouter;
