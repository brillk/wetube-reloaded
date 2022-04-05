import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  location: String,
});

const User = mongoose.model("User", userSchema);
export default User;
/* unique는 단 하나만 생성하도록 한다 */
