import "regenerator-runtime";
import "dotenv/config"; //서버가 시작되는 곳에 env파일을 읽을 수 있게 설정
import "./db";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server";

const PORT = 4000;
const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}🦔`);

app.listen(PORT, handleListening);
