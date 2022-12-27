const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");

const handleEnded = () => {
  const { id } = videoContainer.dataset;
  fetch(`/api/videos/${id}/view`, { method: "POST" });
};

video.addEventListener("ended", handleEnded);
