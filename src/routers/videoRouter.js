import express from "express";
import {
  watch,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
  deleteVideo,
} from "../controllers/videoController.js";

import { protectorMiddleware, videoUpload } from "../middlewares.js";

const videosRouter = express.Router(); //라우터 만들기

videosRouter.get("/:id([0-9a-f]{24})", watch);
videosRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(protectorMiddleware)
  .get(getEdit)
  .post(postEdit);
videosRouter
  .route("/:id([0-9a-f]{24})/delete")
  .all(protectorMiddleware)
  .get(deleteVideo);
videosRouter
  .route("/upload")
  .all(protectorMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);

export default videosRouter;

/* 
regular equation 정규 표현식을 이용해 표기해야할 숫자랑 문자를 패턴화한다
([0-9a-f]{24})  0에서 9, a부터 f로 이루어진 24자 길이의 패턴을 찾아라

id는 파라미터다
파라미터는 url안에 변수를 넣을 수 있다

:id 가 문자열로 보내지지 않고 오직 숫자로만 보내져야 한다
정규식??
+ *
(\\d+)를 넣으면 값을 숫자만 받는다
*/
