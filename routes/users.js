const { deserialize } = require("mongodb");
const mongoose = require("mongoose");
const { serializeUser, deserializeUser } = require("passport");
const plm = require("passport-local-mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/pin");

const userSchema = mongoose.Schema({
  username: String,
  name: String,
  email: String,
  password: String,
  profileImage: String,
  contact: Number,
  boards: {
    type: Array,
    default: []
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "post"
      // refer hum post ko kr rhe hai kyuki id save hogi post ki vo post schema se hogi 
    }
  ]
});

userSchema.plugin(plm);
// isse kya hoga ki passport ko serializeUser and deserialize function de rhe kyuki hme error mai ye aa rha ki jo passport hai vo serializeUser ko nhi jaanta isliye humne plm ki help se use serializeUser or deserializeUser btaaya 

module.exports = mongoose.model("user", userSchema);