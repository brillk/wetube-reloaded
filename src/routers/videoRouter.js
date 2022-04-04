import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController.js";

const videosRouter = express.Router(); //라우터 만들기

videosRouter.get("/:id(\\d+)", watch); //링크를 GET하기
videosRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);
videosRouter.route("/upload").get(getUpload).post(postUpload);

export default videosRouter;

//id는 파라미터다
//파라미터는 url안에 변수를 넣을 수 있다

//:id 가 문자열로 보내지지 않고 오직 숫자로만 보내져야 한다
//정규식??
//+ *
//  (\\d+)를 넣으면 값을 숫자만 받는다
