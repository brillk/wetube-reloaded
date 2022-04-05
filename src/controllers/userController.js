import User from "../models/User";

export const getJoin = (req, res) => res.render("join", { pageTitle: "Join" });
export const postJoin = async (req, res) => {
  const { name, username, email, password, location } = req.body;
  await User.create({
    name,
    username,
    email,
    password, //하지만 db를 열어보면 비밀번호가 나온다 이걸 보안화해보자
    location,
  });
  return res.redirect("/login");
  //만든 정보를 로그인 페이지로 보내자
};
export const edit = (req, res) => res.send("Edit User");
export const removeUser = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("Log in User");
export const logout = (req, res) => res.send("Log out User");
export const see = (req, res) => res.send("See User");
