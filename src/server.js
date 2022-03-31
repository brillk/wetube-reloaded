import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import usersRouter from "./routers/userRouter";
import videosRouter from "./routers/videoRouter";

const PORT = 4000;

const app = express();
const logger = morgan("dev");
app.use(logger);

app.use("/", globalRouter);
app.use("/users", usersRouter);
app.use("/videos", videosRouter);

const handleListening = () =>
  console.log(`✅ Server listening on port http://localhost:${PORT}🦔`);

app.listen(PORT, handleListening);

//각각 독립된 문서를 만들어 export import 해서 더 깔끔한 코드를 만들수 있다
