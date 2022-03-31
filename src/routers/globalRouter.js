import express from "express";

const globalRouter = express.Router(); //라우터 만들기
const handleHome = (req, res) => res.send("Home"); //라우터 안에 들어갈 첫번째 함수 만들기
globalRouter.get("/", handleHome); //링크를 GET하기

export default globalRouter;
