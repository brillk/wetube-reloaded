import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, location, password2 } = req.body;
  const pageTitle = "Join";
  if (password !== password2) {
    return res.render("join", {
      //비밀번호를 두번 확인하는데 서로 다른 비밀번호를 적으면 메시지를 반환
      pageTitle,
      errorMessage: "Password confirmation does not match",
    });
  }
  const exists = await User.exists({ $or: [{ username }, { email }] });
  if (exists) {
    //유저가 이미 있다면 메시지를 반환
    return res.render("join", {
      pageTitle,
      errorMessage: "This username/email is already taken",
    }); //join.pug에 표시해야 한다
  }

  //이메일도 만들어보자
  //$or을 쓰면 둘 중에 하나만 걸려도 에러 메시지를 준다

  await User.create({
    name,
    username,
    email,
    password,
    location,
  });
  return res.redirect("/login");
  /* 
  만든 정보를 다시 들어가려고 하면 중복된 값이라고 에러가 뜨면서 접속이 되지 않는다
  하지만 에러를 유저에게 보여줘야 어떤 일이 발생했는지 알 수 있기 때문에
  에러 메시지를 만들어 보자
  */
};
export const edit = (req, res) => res.send("Edit User");
export const removeUser = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Log in User");
export const logout = (req, res) => res.send("Log out User");
export const see = (req, res) => res.send("See User");
