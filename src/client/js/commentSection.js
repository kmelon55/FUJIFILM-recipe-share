const form = document.getElementById("commentForm");
const recipeContainer = document.getElementById("recipeContainer");
const commentDeleteBtn = document.querySelectorAll(".comment__delete-btn");

const addComment = (text, id) => {
  const recipeComments = document.querySelector(".recipe__comments ul");
  const newComment = document.createElement("li");
  const deleteBtn = document.createElement("button");

  newComment.className = "recipe__comment";
  newComment.dataset.id = id;
  newComment.innerText = ` ${text}`;

  deleteBtn.className = "comment__delete-btn";
  deleteBtn.innerText = "❌";
  deleteBtn.addEventListener("click", handleDelete);

  newComment.appendChild(deleteBtn);

  recipeComments.prepend(newComment);
};

const deleteComment = (element) => {
  element.remove();
};

const handleSubmit = async (e) => {
  e.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value;
  const recipeId = recipeContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/recipes/${recipeId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    const { newCommentId } = await response.json();
    textarea.value = "";
    addComment(text, newCommentId);
  }
};

const handleDelete = async (e) => {
  console.log("click event");
  e.preventDefault();
  const commentEl = e.srcElement.parentElement;
  const commentId = commentEl.dataset.id;
  const response = await fetch(`/api/comment/${commentId}`, {
    method: "DELETE",
  });
  if (response.status === 204) {
    deleteComment(commentEl);
  }
};

form.addEventListener("submit", handleSubmit);
if (commentDeleteBtn) {
  commentDeleteBtn.forEach((el) => el.addEventListener("click", handleDelete));
}
