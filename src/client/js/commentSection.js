const form = document.getElementById("commentForm");
const videoContainer = document.getElementById("videoContainer");
const textarea = document.querySelector("textarea");
const btn = document.querySelector("button");

const addComment = (text) => {
  const videoComments = document.querySelector(".video__comments ul");
  const newComment = document.createElement("li");
  newComment.className = "video__comment";
  newComment.innerText = ` ${text}`;
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const text = textarea.value;
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
  });

  if (response.status === 201) {
    textarea.value = "";
    addComment(text);
  }
};

form.addEventListener("submit", handleSubmit);
