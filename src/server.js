import express from "express";
import morgan from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // 디폴트로 실행되는 파일 디렉토리 설정
app.use(logger);
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "Hello",
    resave: true,
    saveUninitialized: true,
  })
);

/* 
기본적으로 서버와 유저의 연결은 stateless한 성질을 띈다.(wifi가 쭉 연결되어 있는것과 다르게)
이러한 연결 특성으로 인해 매번 연결시 유저는 새로이 서버에 자신을 확인 받아야 함
만약 증표(증거)가 있다면 다시 연결시 유저에 대한 확인이 쉬워짐
쿠기가 증표 역활을 함. 유저는 서버 연결시 서버에게 증표를 건네받음(쿠키는 유저가 보관)
서버는 session으로 해당 증표를 가진 유저의 기록을 저장해둠
유저가 증표(쿠키)를 가지고 오면 서버는 저장되어 있는 session을 통해 유저를 쉽게 확인 
*/

app.use("/", rootRouter);
app.use("/users", usersRouter);
app.use("/videos", videosRouter);

export default app;

/*각각 독립된 문서를 만들어 export import 해서 더 깔끔한 코드를 만들수 있다
pug를 쓰면 html코드를 자동으로 완성해준다
pug를 깔고 app.set("view engine", "pug"); pug를 뷰 엔진으로 설정한다
실제로 pug 파일을 생성한다

pug 파일은 현재 디렉토리에 있는 views폴더에서 실행되는데,
노드가 시작하는 곳(서버)에서 실행되므로 현재 실행되는 곳은
package.json이다 그러므로 현 디렉토리는 wetube가 되었고, 지금은 src라는 디랙토리안에 있다는 걸 알려줘야 한다

app.use(express.urlencoded({ extended: true }));
자바스크립트 object 형식으로 form이 body를 이해하도록 도운다
*/
