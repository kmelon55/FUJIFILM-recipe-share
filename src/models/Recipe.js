import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxLength: 80 },
  fileUrl: [{ type: String, required: true }],
  thumbUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minLength: 2 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    view: { type: Number, default: 0, required: true },
    like: { type: Number, default: 0, required: true },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  comment: [
    { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Comment" },
  ],
});

recipeSchema.static("formatHashtags", function (hashtags) {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

recipeSchema.static("filesArray", function (recipes) {
  let path = [];
  recipes.forEach((element) => {
    path.push(element.path);
  });
  console.log(path);
  return path;
});

const recipe = mongoose.model("Recipe", recipeSchema);
export default recipe;
