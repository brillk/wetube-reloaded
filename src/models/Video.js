import mongoose from "mongoose";

//make schema 모델의 생김새 만들기
const videoSchema = new mongoose.Schema({
  title: String,
  description: String,
  createdAt: Date,
  hashtags: [{ type: String }],
  meta: {
    //extra data
    views: Number,
    rating: Number,
  },
});

const Video = mongoose.model("Video", videoSchema); //1. 데이터의 이름 2. 데이터의 값
export default Video;
