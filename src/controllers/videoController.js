export const trending = (req, res) => res.render("home", { pageTitle: "Home" }); 
export const see = (req, res) => res.render("watch", { pageTitle: "Watch" });
export const edit = (req, res) => res.render("edit", { pageTitle: "Edit" });
export const removeVideo = (req, res) => res.render("remove");

export const search = (req, res) => res.render("search");
export const upload = (req, res) => res.render("upload");

export const writeComment = (req, res) => res.render("Write Comment");

//변수를 제공하는 방법은 render에 파일명을 쓰고 변수를 쓴다. 원하는만큼 넣을 수 있다 