export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
  return res.send("Watch");
};
export const edit = (req, res) => {
  return res.send("Edit");
};
export const removeVideo = (req, res) => {
  return res.send("Remove Video");
};
export const search = (req, res) => res.send("Search Video");
export const upload = (req, res) => res.send("Upload Video");

export const writeComment = (req, res) => res.send("Write Comment");
