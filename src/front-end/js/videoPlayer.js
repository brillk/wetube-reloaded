const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");

const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");

const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currenTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

const comment = document.getElementById("comment");
const deleteComment = document.getElementById("deleteComment");

let controlsTimeout = null;
let controlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayClick = e => {
  //if the video playing, pause it
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMuteClick = e => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = event => {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteBtnIcon.classList = "fas fa-volume-mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = seconds => {
  const startIdx = seconds >= 3600 ? 11 : 14;
  return new Date(seconds * 1000).toISOString().substring(startIdx, 19);
};

//substring (시작 인덱스, 종료 인덱스)

const handleLoadedMetadata = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration)); //비디오의 총 시간을 알아야 한다
  timeline.max = Math.floor(video.duration);
};
const handleTimeUpdate = () => {
  //current Time
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime); //input range에 비디오길이를 추가한다
};

const handleTimelineChange = event => {
  const {
    target: { value },
  } = event;
  video.currentTime = value;
};

const handleFullScreen = e => {
  //풀스크린 조절
  const fullscreen = document.fullscreenElement;

  if (fullscreen) {
    document.exitFullscreen();
    fullScreenIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenIcon.classList = "fas fa-compress";
  }
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }

  if (controlsMovementTimeout) {
    clearTimeout(controlsMovementTimeout);
    controlsMovementTimeout = null;
  } // 오래된 Timeout을 취소하고 새로운 timeout을 만들고 있다.

  //마우스가 비디오안에 나갔다가 다시 들어오면 UI가 사라지는 시간을 초기화한다
  videoControls.classList.add("showing");
  //마우스가 화면안에 가만히 있다면 UI를 사라지게
  controlsMovementTimeout = setTimeout(hideControls, 3000);
};
/*
  handleMousemove 요약
  1. 아무것도 없는 상태에서 비디오 위로 마우스 움직임.
  2. 즉시 showing이라는 클래스가 추가되고 3초짜리 showing을 지우는 타이머를 시작시킴.
  3. 2초후 마우스를 다시 움직임.
  4. if문 구절 때문에 3초짜리 showing을 지우는 타이머가 사라져 버리고, 
  타이머 값이 null로 바뀜 즉 타이머 사라짐.
  5.그대로 클래스 showing만들고 다시 또다른 3초짜리 showing을 
  지우는 타이머 시작!
 */

const handleMouseLeave = () => {
  //마우스가 비디오 안에 있다면 UI를 숨기지 않는다
  controlsTimeout = setTimeout(hideControls, 2000);
};

const keyboardControl = event => {
  if (event.target.tagName !== "TEXTAREA") {
    switch (event.keyCode) {
      case 32:
        handlePlayClick();
        event.preventDefault();
        break;
      case 77:
        handleMuteClick();
        event.preventDefault();
        break;
      case 70:
        handleFullScreen();
        event.preventDefault();
        break;
    }
  }
};
const clickToStop = () => {
  handlePlayClick();
};

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, {
    method: "POST",
  });
};

const handleDelComment = () => {
  const { id } = comment.id;
  fetch(`/api/comment/${id}/delete`, {
    method: "DELETE",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetadata);
video.addEventListener("timeupdate", handleTimeUpdate);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeline.addEventListener("input", handleTimelineChange);
fullScreenBtn.addEventListener("click", handleFullScreen);

window.addEventListener("keydown", keyboardControl);

video.addEventListener("ended", handleEnded); //비디오가 끝난 걸 감지한다
video.addEventListener("click", clickToStop);

//loaded meta data
//date constructor?

/* 
Data Attributes
 data-* 속성은 표준이 아닌 속성이나 추가적인 DOM 속성, 
 Node.setUserData()과 같은 다른 조작을 하지 않고도, 
 의미론적 표준 HTML 요소에 추가 정보를 저장할 수 있도록 해줍니다.
*/
