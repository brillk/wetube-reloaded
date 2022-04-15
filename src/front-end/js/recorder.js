import "regenerator-runtime";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });
  await ffmpeg.load();

  //지금 프론트로 백엔드의 역할을 하고 있다
  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile));

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4");
  //bunch of fucking shortkeys to create Thumbnails, cut it from 1s from video
  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  );

  const mp4File = ffmpeg.FS("readFile", "output.mp4");
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg"); //thunmnail 저장

  //buffer??1mp4Url

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a");
  a.href = mp4Url;
  a.download = "MyRecording.mp4";
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a");
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg";
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");
  //다운로드한 영상과 사진을 unlink, DB에서 삭제시켜준다

  URL.revokeObjectURL(mp4);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
};

const handleStop = () => {
  startBtn.innerText = "Download Recording"; //녹화를 껏다 켰다, 이벤트 리스너를 상호작용
  startBtn.removeEventListener("click", handleStop); //이벤트가 겹치니까 오래된 이벤트를 먼저 없애준다
  startBtn.addEventListener("click", handleDownload);
  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new window.MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = event => {
    videoFile = URL.createObjectURL(event.data);
    /*
    URL.createObjectURL() 정적 메서드는 주어진 객체를 가리키는 URL을 DOMString으로 반환합니다. 
    해당 URL은 자신을 생성한 창의 document가 사라지면 함께 무효화됩니다.
    */
    video.srcObject = null;
    //비디오를 담고 있는 바이너리 데이터가 담겨있다
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
  //동영상은 여기서부터 시작함
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: true,
  });
  video.srcObject = stream;
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
/* 
MediaDevices 인터페이스의 getUserMedia() 메서드는 사용자에게 미디어 입력 장치 사용 권한을 요청하며, 
사용자가 수락하면 요청한 미디어 종류의 트랙을 포함한 MediaStream (en-US)을 반환합니다. 
스트림은 카메라, 비디오 녹화 장치, 스크린 공유 장치 등 하드웨어와 
가장 비디오 소스가 생성하는 비디오 트랙과, 마이크, A/D 변환기 등 
물리적과 가상 오디오 장치가 생성하는 오디오 스트림, 
그리고 그 외의 다른 종류의 스트림을 포함할 수 있습니다.
보통, MediaDevices 싱글톤 객체는 다음과 같이 navigator.mediaDevices를 사용해 접근합니다.
*/
