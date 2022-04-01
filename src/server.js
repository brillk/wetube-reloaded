import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import usersRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // 디폴트로 실행되는 파일 디렉토리 설정
app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videosRouter);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}🦔`);

app.listen(PORT, handleListening);

//각각 독립된 문서를 만들어 export import 해서 더 깔끔한 코드를 만들수 있다
//pug를 쓰면 html코드를 자동으로 완성해준다
//pug를 깔고 app.set("view engine", "pug"); pug를 뷰 엔진으로 설정한다
//실제로 pug 파일을 생성한다

//pug 파일은 현재 디렉토리에 있는 views폴더에서 실행되는데,
//노드가 시작하는 곳(서버)에서 실행되므로 현재 실행되는 곳은
//package.json이다 그러므로 현 디렉토리는 wetube가 되었고, 지금은 src라는 디랙토리안에 있다는 걸 알려줘야 한다
