var express = require('express');
var router = express.Router();
const userModel = require("./users");
const postModel = require("./post");
const passport = require('passport');
const localStrategy = require('passport-local');
const upload = require("./multer");

passport.use(new localStrategy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index', {nav: false});
});

router.get('/register', function(req, res, next) {
  res.render('register', {nav: false});
});

// protected routes 
router.get('/profile', isLoggedin, async function(req, res, next) {
  // res.render('profile');
  const user = 
    await userModel
    .findOne({username: req.session.passport.user})
    .populate("posts");

  res.render("Profile", {user, nav: true});
});

// show pages  
router.get('/show/posts', isLoggedin, async function(req, res, next) {
  // res.render('profile');
  const user = 
    await userModel
    .findOne({username: req.session.passport.user})
    .populate("posts");

  res.render("show", {user, nav: true});
});

// feed page 
router.get('/feed', isLoggedin, async function(req, res, next) {
  // res.render('profile');
  const user = await userModel.findOne({username: req.session.passport.user});

    // we can also limit pages on the feed section 
    const posts = await postModel.find().populate("user");

  res.render("feed", {user, posts ,nav: true});
});

// add page 
router.get('/add', isLoggedin, async function(req, res, next) {
  // res.render('profile');
  const user = await userModel.findOne({username: req.session.passport.user});

  res.render("add", {user, nav: true});
});

// create post
router.post('/createpost', isLoggedin, upload.single("postImage") ,async function(req, res, next) {
  // res.render('profile');
  const user = await userModel.findOne({username: req.session.passport.user});

  const post = await postModel.create({
    user: user._id,
    title: req.body.title,
    description: req.body.description,
    image: req.file.filename
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");

});

// uploading image 

// upload.single('image' --> it is the input imagefile which is going to submit in the form when we browse from the computer)
router.post('/fileupload', isLoggedin, upload.single("image"),async function(req, res, next) {
  // res.send("uploaded ")

  const user = await userModel.findOne({username: req.session.passport.user});

  user.profileImage = req.file.filename; // aapki jo file save hui thi uska naam user.profileImage mai save ho gyi

  await user.save();
  res.redirect("./profile");
});

router.post('/register', function(req, res, next) {
  
  // jo left side mai username hai ye user ke schema se match hona chahiye and right wala part jo register page ke andr inputs se match hona chahiye mtlb (username mai value store hogi jo ohum form submit krenge uske corresponding)

  const data = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,

  })

  userModel.register(data, req.body.password)
  .then(function(){
    passport.authenticate("local")(req, res, function(){
      res.redirect("./profile");
    })
  })
});

// login authentication 
router.post('/login', passport.authenticate("local", {
  failureRedirect: "/",
  successRedirect: "/profile",
}) , function(req, res, next) {

});

// logout 
router.get("/logout", function(req, res, next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

module.exports = router;
