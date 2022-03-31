import express from "express";

//express를 위한 규칙
//1
const app = express();

//configure application
//function ()를 꼭 보내야 한다
//get은 브라우저가 유저한테 보내주는 request다
// (a, b) 인자는 req, res로 나눠진다 무조건 두개로 써야한다 <-- express
//respond 를 리턴해준다
const handleHome = (req, res) => {
  return res.send("YEY"); //res. 의 다른 요소들도 사용하면 값을 다양하게 보낸다
};

app.get("/", handleHome);

const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}`);

//2 app을 listen to request server
app.listen(PORT, handleListening);
