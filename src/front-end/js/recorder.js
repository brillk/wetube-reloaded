const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
  //audio와 video를 받는다
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
  console.log(stream);
};

startBtn.addEventListener("click", handleStart);
