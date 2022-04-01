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
  return res.render("watch", { pageTitle: `Watch ${video.title}`, video });
};
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const removeVideo = (req, res) => res.render("remove");

export const search = (req, res) => res.render("search");
export const upload = (req, res) => res.render("upload");

export const writeComment = (req, res) => res.render("Write Comment");

//변수를 제공하는 방법은 render에 파일명을 쓰고 변수를 쓴다. 원하는만큼 넣을 수 있다
//mixins은 데이터를 받을 수 있는 일종의 미리 만들어진 HTML block 이라 볼 수 있다
//
