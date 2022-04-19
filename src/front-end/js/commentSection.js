const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");

const handleSubmit = event => {
  event.preventDefault(); // 항상 하는 브라우저가 새로고침 후 값이 사라지는걸 방지
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  //지금 어떤 영상에 댓글을 단건지 위해 id를 출력
  const videoId = videoContainer.dataset.id;
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    // video파트에서 POST만 해줘도 됐지만, 댓글은 정보가 담겼으니 body에서 꺼내온다
  }); //비디오에 댓글을 남긴다
  textarea.value = "";
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
