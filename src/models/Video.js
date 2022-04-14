import mongoose from "mongoose";

//make schema 모델의 생김새 만들기
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLenth: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, maxLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    //extra data
    views: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
});
/*
  지금 유저와 비디오가 접점이 없다 따라서 id를 이용해 둘을 엮어보자
  user에는 업로드한 모든 영상과 id를 저장
  video는 해당 영상을 올린 user의 id 를 저장

  ref: mongoose에게 owner에게 id를 저장하겠다고 알려준다
 */

/*
  1. findByIdAndUpdate()에서는 save 훅업, 즉 저장이되지 않는다

  static을 쓰기 위해 필요한 것
  Schema.static, function, 만들고자 하는 static 이름이다
  videoController에 쓰인다

  static is way to add function to a mongoose model
 */

videoSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map(word => (word.startsWith("#") ? word : `#${word}`));
});

/* 
일일히 적기에는 써야할 변수가 많을수도 있으니 디폴트값을 정해주자
 데이터를 세밀하게 적을수록 trim같은 옵션도 사용할 수 있다
 css로도 작동할수 있는데, 왜 DB에도 적어야하나?
 정답은 둘다 적어야한다
 이유는 해킹의 위험이 있다 html에 들어가 코드를 삭제시킬수 있기에
db에 저장시켜 디폴트값을 소환한다
*/
const Video = mongoose.model("Video", videoSchema);
//1. 데이터의 이름 2. 데이터의 값
export default Video;
