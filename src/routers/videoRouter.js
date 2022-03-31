import express from "express";
import {
  see,
  edit,
  removeVideo,
  writeComment,
  upload,
} from "../controllers/videoController.js";

const videosRouter = express.Router(); //라우터 만들기

videosRouter.get("/upload", upload);
videosRouter.get("/:id", see); //링크를 GET하기
videosRouter.get("/:id/edit", edit);
videosRouter.get("/:id/delete", removeVideo);
videosRouter.get("/writeComment", writeComment);
export default videosRouter;
