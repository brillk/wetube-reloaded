import express from "express";

const usersRouter = express.Router(); //라우터 만들기
const handleEditUser = (req, res) => res.send("Edit User"); //라우터 안에 들어갈 첫번째 함수 만들기
usersRouter.get("/edit", handleEditUser); //링크를 GET하기
export default usersRouter;