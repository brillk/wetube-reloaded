export const localsMiddleware = (req, res, next) => {
  //loggedIn이 true, false인지 확인
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user; //유저정보
  console.log(res.locals);
  next();
};
