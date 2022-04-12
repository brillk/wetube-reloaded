import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import usersRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares.js";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views"); // 디폴트로 실행되는 파일 디렉토리 설정
app.use(logger);
app.use(express.urlencoded({ extended: true }));

//세션은 서버에 들어갈 쿠키를 만들어 준다
//쿠키안에는 여러가지가 들어 갈수 있지만,session Id라는 걸 생성한다
app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false, //방문하는 모든 사용자에게 쿠키를 주는게 아닌 로그인한 한정된 사람한테만 주자, 만약 만명이 한꺼번에 오는데 만개의 쿠키를 주면 서버터진다
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
    //원래 session은 memoryStore에 있어서 새로고침하면 사라지는데,
    //현재 session은 mongodb daabase에 저장되어 있다
    //세션은 backend에 호출할떄만 만들어진다
  })
  //Domain은 쿠키를 만드는 백엔드를 알려준다, 현재는 localhost
  //쿠키는 만료날짜가 명시되지 않으면, 창을 닫을 시 기본적으로 14일후 쿠키가 사라진다
);
/*
1. 브라우져에서 서버에 로그인 요청, 로그인이 되면 서버는 세션id를 response해주고
2. 브라우져는 쿠키스토리지에 그 세션id를 보관하고 있다가 이후 
3. 다시 서버에 방문할 시에는 그 세션 id만 보여주면 자동으로 로그인

4. 세션은 서버측에서 제공해주는 데이터, 
5. 쿠키는 클라이언트측에서 저장하고 사용하는 데이터
클라이언트가 해당 값을 쿠키에 저장하고 매 요청때마다 서버에게 전달
세션은 서버가 만들어서 제공해주다보니 서버가 재부팅되면 초기화 된다. 
(그래서 DB에 저장해서 관리를 한다는 소리. 실 운영에선 서버가 꺼지는 일은 없으니깐.)
세션의 값은 서버가 만들어주는 고유값이다보니 
해당 값을 기준으로 클라이언트에서 요청한 건에 대해 유저를 특정지을 수 있다
서버가 세션을 생성한 기점은 middleware로 express-session을 추가했을때부터 생성됨.
*/

/*
local에 들어가서 값을 선언하고 pug파일에 #{선언된 값}을 
쓰면 template와 pug의 합작품이 나온다

res.locals.sexy = "Me";

title = #{sexy}
*/
app.use(localsMiddleware);
app.use("/uploads", express.static("uploads")); //static files serving 활성화 <- 폴더를 브라우저에게 노출시키게 한다
app.use("/static", express.static("assets")); // 파일을 공개적으로 돌린다
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
