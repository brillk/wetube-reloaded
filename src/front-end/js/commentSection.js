const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  newComment.appendChild(icon);
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};
const handleSubmit = async event => {
  event.preventDefault(); // 항상 하는 브라우저가 새로고침 후 값이 사라지는걸 방지
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  //지금 어떤 영상에 댓글을 단건지 위해 id를 출력
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const { status } = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    // video파트에서 POST만 해줘도 됐지만, 댓글은 정보가 담겼으니 body에서 꺼내온다
  }); //비디오에 댓글을 남긴다
  textarea.value = "";
  if (status === 201) {
    addComment();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
