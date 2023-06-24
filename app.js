//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const homeStartingContent = "Welcome to Daily Journal, your trusted companion on the path of self-discovery and personal growth. In this fast-paced world, we invite you to slow down, take a moment for yourself, and embark on a journey of daily reflections. Our platform provides a safe and nurturing space for you to pour your thoughts, dreams, and emotions onto the pages of your digital journal. Unleash your creativity, capture life's precious moments, and create a tapestry of memories that will be cherished for years to come. Join our community of passionate journaling enthusiasts and let the power of words guide you towards clarity, mindfulness, and a deeper understanding of yourself.";
const aboutContent = "At Daily Journal, we believe in the profound impact of journaling on our well-being and personal development. We understand that life can be a beautiful yet complex journey, filled with joys, challenges, and moments of self-discovery. Our mission is to empower individuals like you to embrace the transformative power of journaling. Through the art of self-expression, you can unlock your inner voice, gain insights into your thoughts and emotions, and cultivate a greater sense of self-awareness. Join us as we create a supportive community where stories are shared, experiences are celebrated, and personal growth is nurtured. Together, let's embark on a journey of reflection, inspiration, and authentic living.";
const contactContent = "We value your voice and would love to hear from you. Whether you have a question, feedback, or a heartfelt story to share, we're here to listen. Reach out to us through the provided contact information, and let's connect. Your thoughts matter, and together, we can cultivate a supportive and inspiring space for all journaling enthusiasts. We look forward to hearing from you.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];
mongoose.connect('mongodb://127.0.0.1/blogDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('DB is connected'))
  .catch(err => console.error(err));

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

app.get("/", async function (req, res) {
  try {
    const posts = await Post.find();
    res.render("home", { startingContent: homeStartingContent, posts: posts });
  } catch (err) {
    console.error(err);
    res.render("home", { startingContent: homeStartingContent, posts: [] });
  }
});


app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  post.save()
    .then(() => {
      res.redirect("/");
    })
    .catch(err => {
      console.error(err);
      res.redirect("/");
    });
});

app.get("/posts/:postName", async function (req, res) {
  const requestedTitle = req.params.postName;

  try {
    const post = await Post.findOne({ title: requestedTitle });
    if (post) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});


// app.get("/posts/:postName", function(req, res){
//   const requestedTitle = _.lowerCase(req.params.postName);

//   posts.forEach(function(post){
//     const storedTitle = _.lowerCase(post.title);

//     if (storedTitle === requestedTitle) {
//       res.render("post", {
//         title: post.title,
//         content: post.content
//       });
//     }
//   });

// });

app.listen(3000, function() {
  console.log("Server started on port 3000");
});


