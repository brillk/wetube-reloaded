let videos = [
  {
    title: "First Video",
    rating: 5,
    comments: 2,
    createdAt: "2m ago",
    views: 87,
    id: 1,
  },
  {
    title: "Second Video",
    rating: 5,
    comments: 2,
    createdAt: "2m ago",
    views: 87,
    id: 2,
  },
  {
    title: "Third Video",
    rating: 5,
    comments: 2,
    createdAt: "2m ago",
    views: 87,
    id: 3,
  },
];

export const trending = (req, res) => {
  return res.render("home", { pageTitle: "Home", videos });
};
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("watch", { pageTitle: `Watch: ${video.title}`, video });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id - 1];
  return res.render("edit", { pageTitle: `Editing: ${video.title}`, video });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id - 1].title = title; //제목 수정하기 -> 이건 진짜로 된건 아님 구동만 할뿐
  return res.redirect(`/videos/${id}`);
};

//more practice
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = (req, res) => {
  //add video array
  return res.redirect("/");
};

//변수를 제공하는 방법은 render에 파일명을 쓰고 변수를 쓴다. 원하는만큼 넣을 수 있다
//mixins은 데이터를 받을 수 있는 일종의 미리 만들어진 HTML block 이라 볼 수 있다
//
//1. controller를 먼저 만들자
//2. router를 만들자
