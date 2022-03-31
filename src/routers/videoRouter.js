import express from "express";
import { watch, edit, removeVideo, writeComment } from "../controllers/videoController.js";

const videosRouter = express.Router(); //라우터 만들기

videosRouter.get("/watch", watch); //링크를 GET하기
videosRouter.get("/edit", edit);
videosRouter.get("/removeVideo", removeVideo);
videosRouter.get("/writeComment", writeComment);
export default videosRouter;
