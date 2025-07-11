// const { deserialize } = require("mongodb");
const mongoose = require("mongoose");
// const { serializeUser, deserializeUser } = require("passport");

const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
  },
  title: String,
  description: String,
  image: String,
  
});

// userSchema.plugin(plm);
// isse kya hoga ki passport ko serializeUser and deserialize function de rhe kyuki hme error mai ye aa rha ki jo passport hai vo serializeUser ko nhi jaanta isliye humne plm ki help se use serializeUser or deserializeUser btaaya 

module.exports = mongoose.model("post", postSchema);