import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController.js";

const videosRouter = express.Router(); //라우터 만들기


videosRouter.route("/upload").get(getUpload).post(postUpload);
videosRouter.get("/:id([0-9a-f]{24})", watch); //링크를 GET하기
videosRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
//regular equation 정규 표현식을 이용해 표기해야할 숫자랑 문자를 패턴화한다
// ([0-9a-f]{24})  0에서 9, a부터 f로 이루어진 24자 길이의 패턴을 찾아라
export default videosRouter;

//id는 파라미터다
//파라미터는 url안에 변수를 넣을 수 있다

//:id 가 문자열로 보내지지 않고 오직 숫자로만 보내져야 한다
//정규식??
//+ *
//  (\\d+)를 넣으면 값을 숫자만 받는다
