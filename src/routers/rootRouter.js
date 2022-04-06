import express from "express";
import { home, search } from "../controllers/videoController";
import {
  getJoin,
  postJoin,
  getLogin,
  postLogin,
} from "../controllers/userController";

const rootRouter = express.Router(); //라우터 만들기

rootRouter.get("/", home); //링크를 GET하기
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);
export default rootRouter;

//express-session을 써서 유저의 정보가 db에 저장되도록 해보자 