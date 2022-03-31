import express from "express";

const videosRouter = express.Router(); //라우터 만들기
const handleWatchVideo = (req, res) => res.send("Watch Video"); //라우터 안에 들어갈 첫번째 함수 만들기
videosRouter.get("/watch", handleWatchVideo); //링크를 GET하기
export default videosRouter;
