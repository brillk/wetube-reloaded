import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  avatarUrl: String,
  socialOnly: { type: Boolean, default: false },
  username: { type: String, required: true, unique: true },
  password: { type: String },
  name: { type: String, required: true },
  location: String,
});
/*
hashing password
비밀번호를 해싱하면 정해진 랜덤 번호로 바뀐다 
이걸 "결정적 함수" deterministic funcion라고 한다

bcrypt를 이용해 해싱을 할수 있다 
saltround라고 있는데, 해싱된 값을 또 해싱해주는 옵션이다 = 5 

유저의 정보를 save하기 전의 비밀번호를 해싱해준다
*/
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", userSchema);
export default User;
/* unique는 단 하나만 생성하도록 한다 */
