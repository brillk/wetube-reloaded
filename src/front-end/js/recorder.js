const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview");

let stream;
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = "MyRecording.webm";
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording"; //녹화를 껏다 켰다, 이벤트 리스너를 상호작용
  startBtn.removeEventListener("click", handleStop);
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
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
};

const init = async () => {
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
