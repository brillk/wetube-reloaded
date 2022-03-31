import express from "express";
import logger from "morgan";
//express를 위한 규칙
//1
const app = express();

//configure application
//function ()를 꼭 보내야 한다
//get은 브라우저가 유저한테 보내주는 request다
// (a, b) 인자는 req, res로 나눠진다 무조건 두개로 써야한다 <-- express
//respond 를 리턴해준다

const Middleware = (req, res, next) => {
  console.log("Im in middle");

  next();
};

const handleHome = (req, res) => {
  return res.send("YEY"); //res. 의 다른 요소들도 사용하면 값을 다양하게 보낸다
};
// 미들웨어는 진짜 중간에 넣어야 작동한다, 끝으로 넣으면 안나옴
app.get("/", Middleware, handleHome);

const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}`);


  
//2 app을 listen to request server
app.listen(PORT, handleListening);

//middleware
//중간에 있는 소프트웨어 req, res 사이에 있다
//req res next 가 있는다 next는 다음 함수를 호출해준다 next()
//만약 미들웨어가 리턴을 하고 있다면 함수는 그걸로 끝이난다
//더이상 다른 함수로 넘어가지 않는다
//next가 붙어 있다면 어떤 함수든지 middleware가 될 수 있다.

//ap.use() 이걸 쓸수도 있다
