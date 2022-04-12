import User from "../models/User";
import Video from "../models/Video";
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
    //이걸 3개를 url에 넣어야 한다
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
        username: userData.login,
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
//지금 유저의 정보(user object)를 가져올떄 session에 저장했기 때문에
//req.session.~ 이 형태로 가져와야한다
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { email, username, name, location },
    file,
  } = req;

  const findUsername = await User.findOne({ username });
  const findEmail = await User.findOne({ email });

  if (
    (findUsername != null && findUsername._id != _id) ||
    (findEmail != null && findEmail._id != _id)
  ) {
    return res.render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "User Exist",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      //업로드한 파일이 없거나  undefined일때 원래 쓰던 avatar를 리턴
      //절대 파일을 DB에 넣지 않는다 파일의 위치를 저장한다
      email,
      username,
      name,
      location,
    },
    { new: true }
  );

  req.session.user = updatedUser;

  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  // 1. login한 사람이라면 비밀번호를 보여주고 고치게 한다
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  // 2. 누가 로그인 했는지 알아야한다
  const {
    session: {
      user: { _id },
    },
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;

  const user = await User.findById(_id);
  //지금 session에 있는 값을 변경했기 때문에 session도 업뎃을 해야한다
  //변수로 지정해 비밀번호를 바꿀때마다 새로운 값을 넣는다
  const ok = await bcrypt.compare(oldPassword, user.password);
  if (!ok) {
    //원래 비밀번호를 틀리면 리턴
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "Current password is incorrect",
    });
  }

  if (newPassword !== newPasswordConfirm) {
    //비밀번호 비교
    return res.status(400).render("users/change-password", {
      pageTitle: "Change Password",
      errorMessage: "New password does not match",
    });
  }

  // 3. 바꾼 비밀번호를 업데이트 하자 / promise는 await
  //save 함수를 써야하니까 session에서 로그인된 user를 찾아야 한다

  user.password = newPassword;
  await user.save();

  //send notification to change password
  return res.redirect("/users/logout");
};

export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("videos"); //
  //내 id를 owner로 가진 video를 찾을 수 있다
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found" }); //여기 mongoose연습??
  }
  return res.render("users/profile", { pageTitle: user.name, user });
};

/*
현재 DB에 업뎃이 된 값이 저장되었는데, 웹상으로 바뀌지 않는다 고쳐보자
session은 로그인할때 한번만 저장된다. 그러니 값을 바꿔도 초기 값만 나온다
session을 업데이트 해보자

 req.params are the variables in a URL.
/movies/:id can be found in req.params.id

req.query is the data on the query of the URL
/movies?filter=views can be found in req.query.filter
*/
