const recipeContainer = document.getElementById("videoContainer");
const recipe = document.querySelector("video");

const handleEnded = () => {
  const { id } = recipeContainer.dataset;
  fetch(`/api/recipes/${id}/view`, { method: "POST" });
};

recipe.addEventListener("ended", handleEnded);
