const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const deleteBtn = document.querySelectorAll("#deleteCommentBtn");

const addComment = (text, commentId) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  const icon = document.createElement("i");
  icon.className = "fas fa-comment";
  const span = document.createElement("span");
  span.innerText = ` ${text}`;
  const span2 = document.createElement("span");
  span2.innerText = "❌";

  span2.dataset.id = commentId;
  span2.dataset.videoid = videoContainer.dataset.id;
  span2.id = "newDeleteCommentBtn";
  span2.className = "video__comment-delete";

  newComment.appendChild(icon);
  newComment.appendChild(span);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);

  const newDeleteCommentBtn = document.querySelector("#newDeleteCommentBtn");
  newDeleteCommentBtn.addEventListener("click", handleDelete);
};

const delcomment = event => {
  const commentContainer = document.querySelector(".video__comments ul");
  const commentList = event.target.parentNode;
  commentContainer.removeChild(commentList);
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

  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
    // video파트에서 POST만 해줘도 됐지만, 댓글은 정보가 담겼으니 body에서 꺼내온다
  }); //비디오에 댓글을 남긴다
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    addComment(text, newCommentId);
  }
};

const handleDelete = async event => {
  const { id, videoid } = event.target.dataset;
  const response = await fetch(`/api/videos/${videoid}/comments/${id}/delete`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, videoid }),
  });
  if (response.status === 200) {
    event.target.parentNode.remove();
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}
if (deleteBtn)
  deleteBtn.forEach(btn => btn.addEventListener("click", handleDelete));
