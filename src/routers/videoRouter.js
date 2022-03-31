import express from "express";
import {
  see,
  edit,
  removeVideo,
  writeComment,
  upload,
} from "../controllers/videoController.js";

const videosRouter = express.Router(); //라우터 만들기

videosRouter.get("/writeComment", writeComment);
videosRouter.get("/upload", upload);
videosRouter.get("/:id(\\d+)", see); //링크를 GET하기
videosRouter.get("/:id(\\d+)/edit", edit);
videosRouter.get("/:id(\\d+)/delete", removeVideo);
export default videosRouter;

//id는 파라미터다
//파라미터는 url안에 변수를 넣을 수 있다

//:id 가 문자열로 보내지지 않고 오직 숫자로만 보내져야 한다
//정규식??
//+ *
//  (\\d+)를 넣으면 값을 숫자만 받는다
