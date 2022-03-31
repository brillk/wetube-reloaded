import express from "express";

//express를 위한 규칙
//1
const app = express();

//configure application
//function ()를 꼭 보내야 한다
//get은 브라우저가 유저한테 보내주는 request다
app.get("/", () => console.log("Somebody"));

const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}`);

//2 app을 listen to request server
app.listen(PORT, handleListening);

//GET Method
