const videoContainer = document.getElementById("vieoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const btn = form.querySelector("button");

const handleSubmit = event => {
  event.preventDefault(); // 항상 하는 브라우저가 새로고침 후 값이 사라지는걸 방지
  const text = textarea.value;
  //지금 어떤 영상에 댓글을 단건지 위해 id를 출력
  const video = videoContainer.dataset.id;
};

form.addEventListener("submit", handleSubmit);
