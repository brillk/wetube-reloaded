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
1. 브라우져에서 서버에 로그인 요청, 로그인이 되면 서버는 세션id를 response해주고
2. 브라우져는 쿠키스토리지에 그 세션id를 보관하고 있다가 이후 
3. 다시 서버에 방문할 시에는 그 세션 id만 보여주면 자동으로 로그인

4. 세션은 서버측에서 제공해주는 데이터, 
5. 쿠키는 클라이언트측에서 저장하고 사용하는 데이터

req.sessiontStore() 사용했을때 한번은 undefined가 나온 이유가 세션은 
서버에서 만들어줘야 하는데 클라이언트가 첫 요청때 세션을 가지고있을리 없으니 undefined이 나온거고 
그 이후 요청부턴 첫번째 요청때 세션을 만들어서 넘겨줬으니 

클라이언트가 해당 값을 쿠키에 저장하고 매 요청때마다 서버에게 전달
세션은 서버가 만들어서 제공해주다보니 서버가 재부팅되면 초기화 된다. 
(그래서 DB에 저장해서 관리를 한다는 소리. 실 운영에선 서버가 꺼지는 일은 없으니깐.)
세션의 값은 서버가 만들어주는 고유값이다보니 
해당 값을 기준으로 클라이언트에서 요청한 건에 대해 유저를 특정지을 수 있다
서버가 세션을 생성한 기점은 middleware로 express-session을 추가했을때부터 생성됨.
*/

app.use((req, res, next) => {
  req.sessionStore.all((error, sessions) => {
    console.log(sessions);
    next();
  });
});

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
