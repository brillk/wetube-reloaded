import multer from "multer";
import multerS3 from "multer-s3";
import aws from "aws-sdk";

const s3 = new aws.S3({
  credentials: {
    accessKeyId: process.env.AWS_ID,
    secretAccessKey: process.env.AWS_SECRET,
  },
});

const multerUploaded = multerS3({
  s3: s3,
  bucket: "wetube-created-by-kjh",
});

export const localsMiddleware = (req, res, next) => {
  //loggedIn이 true, false인지 확인
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.siteName = "Wetube";
  res.locals.loggedInUser = req.session.user || {};
  next();
};

//현재 로그인이 안된 유저가 프로필을 수정할 수 있다
//url로도 들어가지 못하게 막자

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Log in first.");
    return res.redirect("/login");
  }
};

//로그인을 했는데, 다시 로그인 페이지로 가지 않게 설정
export const publicOnlyMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.redirect("/");
  }
};

export const avatarUpload = multer({
  dest: "uploads/avatars/",
  limits: {
    fileSize: 3000000,
  },
  storage: multerUploaded,
});

export const videoUpload = multer({
  dest: "uploads/videos/",
  limits: {
    fileSize: Infinity, // byte?
  },
  storage: multerUploaded,
});

//서버에 저장할수 있게 됐다