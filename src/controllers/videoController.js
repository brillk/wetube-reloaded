import Video from "../models/Video";
import User from "../models/User";
import Comment from "../models/Comment";

/* 
callback / Video.find({}, (error, videos) => {});
보통의 콜백 함수는 리턴을 함수로 하고 에러를 또다시 리턴한다
if (error) {
  consoel.log("error");
} else {
  console.log("Normal");
}
호출을 한다면 순서대로 되는 게 아닌 출력 우선순위가 달라져서
주의하면서 써야한다

promise / async await
DB를 기다려 준다
바로 출력이 된다
오류는 try-catch 구문으로 잡는다

1. return의 역할 : 본질적인 return의 역할보다는 function을 
마무리짓는 역할로 사용되고 있음.
- 이러한 경우 return이 없어도 정상적으로 동작하지만 
실수를 방지하기 위해 return을 사용
2. render한 것은 다시 render할 수 없음
- redirect(), sendStatus(), end() 등등 포함 (express에서 오류 발생)

*/

export const home = async (req, res) => {
  //sort 어떤 방식으로 정렬할 건지 정할수 있다 asc | desc
  const videos = await Video.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", videos });
};

export const watch = async (req, res) => {
  //upload를 하면 watch 를 부르기 때문에 오류가 난다
  //watch.pug를 수정
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  /*
  Population은 문서의 지정된 경로를 다른 컬렉션의 문서로 
  자동 교체하는 프로세스입니다. 
  단일 문서, 여러 문서, 일반 개체, 여러 일반 개체 또는 
  쿼리에서 반환된 모든 개체를 채울 수 있습니다.
  
  video에 유저 아이디를 저장시키면 다양한 구현이 가능하다
  */
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("watch", { pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session; //사용자의 id

  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  } // 영상 수정을 작성자만 이 url로 들어오게 한다
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    //type이 서로 달라 작동이 되지 않았다
    return res.status(403).redirect("/");
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, hashtags, description } = req.body;
  const video = await Video.findbyId(id);
  /* 
  postEdit에서 video.owner이 undefinded가 나옵니다! 
  이유는 video를 가져올때 Video.exists로 가져오는데 
  exists메소드는 boolean을 리턴하기때문에 
  video.owner이 undefinded으로 나와요
  video = await Video.exists({ _id: id });
  밑의 코드로 변환
  const video = await Video.findbyId(id);
  
  */
  const {
    user: { _id },
  } = req.session; //사용자의 id

  //exists 는 필터를 필요로 하고, 어떤것이든 들어갈 수 있다.
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }
  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  //mongoose가 제공하는 function을 써서 간단하게 줄였다..사실 간단하진 않다..
  //Video는 model 즉 데이터베이스의 이름이므로 다른 옵션들을 쓸 수 있다
  //영상을 생성하거나 업뎃 전에 작동할 function의 필요성을 이해
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Changes saved.");
  return res.redirect(`/videos/${id}`);
};

//more practice
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { video, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newVideo = await Video.create({
      title,
      description,
      fileUrl: video[0].path,
      thumbUrl: thumb[0].path.replace(/[\\]/g, "/"),
      owner: _id, //현재 로그인된 유저만 쓸수 있다
      //newVideo의 id를 User의 videos array에 추가해줄거다
      hashtags: Video.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    user.save();
    //user, video가 서로 연결되었다
    return res.redirect("/");
  } catch (error) {
    return res.status(400).render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

/*저장을 하는 방법에는 두가지가 있는데 하나는 위처럼 하는거고, 두번째는
await Video.create({}) 로 묶어주고, try-catch로 오류를 잡아준다

변수를 제공하는 방법은 render에 파일명을 쓰고 변수를 쓴다. 원하는만큼 넣을 수 있다
mixins은 데이터를 받을 수 있는 일종의 미리 만들어진 HTML block 이라 볼 수 있다

1. 추가 동작을 넣으려면 controller를 먼저 만들자
2. router를 만들자

mongodb가 좋은 이유 document-base라서, 대부분의 db는 sql-base 엑셀시트로 이루어져 있다

*/

//삭제
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session; //사용자의 id
  const video = await Video.findById(id);
  //userdb에 남아있는 videos도 삭제
  const user = await User.findById(_id);

  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video not found." });
  }

  if (String(video.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndDelete(id);
  user.videos.splice(user.videos.indexOf(id), 1);
  user.save();
  return res.redirect("/");
};

/*
  라우터로 지정한 :id -> req.params
  pug파일에서 input으로 받은 내용 -> req.body(form이 POST일 때)
  pug파일에서 input으로 받은 url내용 -> req.query (form이 GET일 때)
*/

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(`${keyword}$`, "i"),
        //정규식을 써서 keyword가 포함된 제목을 찾게 도와준다
        //new 는 새로운 object를 만들어 준다
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", videos });
};
/*
  output: search?keyword=new
  new는 제목이다 title
  if-else when searching video's value is null or undefined
  */

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views = video.meta.views + 1;
  video.save();
  //백엔드 처리 탬플릿을 하지 않고,
  //url도 바꾸지 않는 백엔드 처리
  return res.sendStatus(200); //front-end 호출
};

//front-end webpack - file converter

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const comment = await Comment.create({
    text,
    owner: user._id,
    video: id,
  });
  video.comments.push(comment._id); //video에 _id(from DB)글을 표시 from populate()"Comment"
  video.save();
  return res.sendStatus(201);
};
