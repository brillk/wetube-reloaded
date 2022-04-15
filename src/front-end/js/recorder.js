const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
};

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
