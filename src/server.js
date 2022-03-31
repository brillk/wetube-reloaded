import express from "express";

//express를 위한 규칙
//1
const app = express();

const PORT = 4000;
const handleListening = () => console.log(`✅Server listening on port http://localhost:${PORT}`);

//2 app을 listen to request server
app.listen(PORT, handleListening);
