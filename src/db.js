import mongoose from "mongoose";

//새로운 db를 만들었다 db에 연결함
mongoose.connect(process.env.DB_URL);

const db = mongoose.connection;
const handleOpen = () => console.log("✅ Connected to DB");
const handleError = error => console.log("❌ DB Error", error);

db.on("error", handleError); //계속 발생
db.once("open", handleOpen); //한번만 빌생
