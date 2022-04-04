import mongoose from "mongoose";

//make schema 모델의 생김새 만들기
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, default: String },
  description: { type: String, required: true, default: String },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String }],
  meta: {
    //extra data
    views: { type: Number, default: 0, required: 0 },
    rating: { type: Number, default: 0, required: 0 },
  },
});
//일일히 적기에는 써야할 변수가 많을수도 있으니 디폴트값을 정해주자
const Video = mongoose.model("Video", videoSchema); //1. 데이터의 이름 2. 데이터의 값
export default Video;
