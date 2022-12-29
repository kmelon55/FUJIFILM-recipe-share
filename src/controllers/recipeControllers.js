import Recipe from "../models/Recipe";
import Comment from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
  const recipes = await Recipe.find({})
    .sort({ createdAt: "desc" })
    .populate("owner");
  return res.render("home", { pageTitle: "Home", recipes });
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id)
    .populate("owner")
    .populate("comment");
  if (!recipe) {
    return res.status(400).render("404", { pageTitle: "recipe not found" });
  }
  console.log(recipe);
  res.render("watch", { pageTitle: recipe.title, recipe });
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.status(404).render("404", { pageTitle: "recipe not found" });
  }
  if (String(recipe.owner) !== String(_id)) {
    req.flash("error", "Not authorized");
    return res.status(403).redirect("/");
  }
  res.render("edit", { pageTitle: `Edit: ${recipe.title}`, recipe });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const { title, description, hashtags } = req.body;
  const recipe = await Recipe.exists({ _id: id });
  if (!recipe) {
    return res.status(400).render("404", { pageTitle: "recipe not found" });
  }
  if (String(recipe.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await recipe.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: recipe.formatHashtags(hashtags),
  });
  return res.redirect(`/recipes/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload recipe" });
};

export const postUpload = async (req, res) => {
  const {
    user: { _id },
  } = req.session;
  const { recipe, thumb } = req.files;
  const { title, description, hashtags } = req.body;
  try {
    const newRecipe = await Recipe.create({
      title,
      description,
      fileUrl: recipe[0].path,
      thumbUrl: thumb[0].path,
      owner: _id,
      hashtags: Recipe.formatHashtags(hashtags),
    });
    const user = await User.findById(_id);
    user.recipes.push(newRecipe._id);
    user.save();
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.status(400).render("upload", {
      pageTitle: "Upload recipe",
      errorMessage: error._message,
    });
  }
};

export const deleterecipe = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.status(404).render("404", { pageTitle: "recipe not found" });
  }
  if (String(recipe.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Recipe.findByIdAndDelete(id);
  return res.redirect("/");
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let recipes = [];
  if (keyword) {
    recipes = await Recipe.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    }).populate("owner");
  }
  return res.render("search", { pageTitle: "Search", recipes });
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const recipe = await Recipe.findById(id);
  if (!recipe) {
    return res.sendStatus(404);
  }
  recipe.meta.view = recipe.meta.view + 1;
  await recipe.save();
  return res.sendStatus(200);
};

export const createComment = async (req, res) => {
  const {
    session: { user },
    body: { text },
    params: { id },
  } = req;

  const recipe = await Recipe.findById(id);

  if (!recipe) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    recipe: id,
  });
  recipe.comment.push(comment._id);
  recipe.save();
  return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const comment = await Comment.findById(id);
  if (!comment) {
    return res.status(404).render("404", { pageTitle: "Comment not found" });
  }
  if (String(comment.owner) !== String(_id)) {
    return res.status(403).redirect("/");
  }
  await Comment.findByIdAndDelete(id);
  return res.sendStatus(204);
};
