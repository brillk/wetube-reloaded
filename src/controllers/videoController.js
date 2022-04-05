import Video from "../models/Video";

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
  const videos = await Video.find({});
  console.log(videos);
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = async (req, res) => {
  //upload를 하면 watch 를 부르기 때문에 오류가 난다
  //watch.pug를 수정
  const { id } = req.params;
  const video = await Video.findById(id);
  //이제 아이디를 읽을 수 있으니 출력해보자
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
    //만약 동영상이 없고 null상태라면 404.pug를 보낸다
  }
  return res.render("watch", { pageTitle: video.title, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  return res.render("edit", { pageTitle: `Edit: ${video.title}`, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, hashtags, description } = req.body;
  const video = await Video.exists({ _id: id });
  //exists 는 필터를 필요로 하고, 어떤것이든 들어갈 수 있다.
  if (!video) {
    return res.render("404", { pageTitle: "Video not found." });
  }
  //mongoose가 제공하는 function을 써서 간단하게 줄였다..사실 간단하진 않다..
  //Video는 model 즉 데이터베이스의 이름이므로 다른 옵션들을 쓸 수 있다
  //영상을 생성하거나 업뎃 전에 작동할 function의 필요성을 이해
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  return res.redirect(`/videos/${id}`);
};

//more practice
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    await Video.create({
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect("/");
  } catch (error) {
    return res.render("upload", {
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

  show dbs
 admin   0.000GB
 config  0.000GB
 local   0.000GB
 wetube  0.000GB
  use wetube
 switched to db wetube
  show collections
 videos

 여기서 콜렉션은 document들의 묶음이다
*/

//삭제
export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  await Video.findOneAndDelete(id);
  return res.redirect("/");
};
