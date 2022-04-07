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
  /*
  check if account exists
  check if password correct
  using bcrypt.compare
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

  req.session.loggedIn = true; //모든 브라우저마다 다른 세션 값을 가지고 있다
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email", //보고자 하는 정보의 옵션들은 공백으로 띄워준다
    //scope = 유저에게서 얼마나 많이 정보를 읽어내고
    //어떤 정보를 가져올 것에 대한것
    //여러 정보들은 우리가 선택해서 볼 수 있게 할 수 있다.
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  //-이제 Authorize하면 전송되는 callback URL에 대해서 작성할 예정-
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
    //이걸 url에 넣어야 한다
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  const data = await fetch(finalUrl, {
    method: "POST",
    headers: "application/json",
    /*
    1. fetch('url')로 다른 서버를 통해 데이터를 가져올 수있다.
    하지만, res.body 에 담겨있는 날것의 url로는 
    제대로 된 객체를 받아올 수 없다.
    2.때문에 중간에 .json 함수가 response의 스트림을 가져와 끝까지 읽고,
    res.body의 텍스트를 promise의 형태로 반환한다.
    3. 다른 서버에서 데이터를 object 형식으로 받아온다
    "lon":139.01,"lat":35.02
    */
  });
  const json = await data.json();
  console.log(json);
};
export const edit = (req, res) => res.send("Edit User");
export const removeUser = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Log out User");
export const see = (req, res) => res.send("See User");
