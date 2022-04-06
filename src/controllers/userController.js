import User from "../models/User";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, location, password2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.status(400).render("join", {
      //비밀번호를 두번 확인하는데 서로 다른 비밀번호를 적으면 메시지를 반환
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    //유저가 이미 있다면 메시지를 반환
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    }); //join.pug에 표시해야 한다
  }

  //이메일도 만들어보자
  //$or을 쓰면 둘 중에 하나만 걸려도 에러 메시지를 준다

  try {
    await User.create({
      name,
      username,
      email,
      password,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    //error 처리하기
    return res.status(400).render("join", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }

  /* 
  만든 정보를 다시 들어가려고 하면 중복된 값이라고 에러가 뜨면서 접속이 되지 않는다
  하지만 에러를 유저에게 보여줘야 어떤 일이 발생했는지 알 수 있기 때문에
  에러 메시지를 만들어 보자
  */
};
export const getLogin = (req, res) =>
  res.render("login", { pageTitle: "Login" });
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const pageTitle = "Login";
  /*check if account exists
  //check if password correct
  //using bcrypt.compare
  어떤 유저가 로그인하는지 DB에서 가져온다
  */
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "An account with this username do not exists",
    });
  }
  //비밀번호가 저장된 것과 같은지 비교
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "Wrong Password",
    });
  }
  console.log("Log User In! Coming Soon");
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const removeUser = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out User");
export const see = (req, res) => res.send("See User");
