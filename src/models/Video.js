import mongoose from "mongoose";

//make schema 모델의 생김새 만들기
const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLenth: 80 },
  description: { type: String, required: true, trim: true, maxLength: 20 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    //extra data
    views: { type: Number, default: 0, required: true },
    rating: { type: Number, default: 0, required: true },
  },
});

//this는 우리가 저장하고자 하는 문서를 가리키는 것
//pre 그러니까 save라는 function이 일어나기 전에
//지금 무엇을 어떤 걸로 변화시킬수도 있다
videoSchema.pre("save", async function () {
  //이렇게 쓰는 이유는
  //여러 값을 적었을때, 여러개의 값이 담긴 array가 아닌
  //하나의 값이 담긴 array기때문에
  this.hashtags = this.hashtags[0]
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
