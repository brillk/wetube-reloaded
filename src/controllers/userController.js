import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "cross-fetch";

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
  const user = await User.findOne({ username, socialOnly: false });
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
    //어떤 정보를 가져올 것에 대한 것
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

  const tokenRequest = await (
    await fetch(finalUrl, {
      //fetch는 서버에는 없고 브라우저에만 존재한다 -> cross-fetch 설치
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`, //scope에서 적었기 때문에 이메일 사용이 가능
        },
      })
    ).json();

    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      email => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    } //이미 로그인 한 유저인지 검사한다
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      //create an account -> 깃헙으로 로그인 했으면 비밀번호는 없을테니 id로 검사
      user = await User.create({
        avatarUrl: userData.avatar_url,
        name: userData.name,
        username: userData.login ? userData.login : "Unknown",
        email: emailObj.email,
        password: "",
        socialOnly: true,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};

export const getEdit = (req, res) => {
  return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = (req, res) => {
  return res.render("edit-profile");
};

export const see = (req, res) => res.send("See User");
