require("dotenv").config();
const express = require("express");
const cors = require("cors");
const User = require("./models/User");
const Post = require("./models/Post");
const mongoose = require("mongoose");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const { log } = require("console");

const salt = bcrypt.genSaltSync(10);
const secret = process.env.SECRET;

app.use(cors({ credentials: true, origin: "https://blog-app-mo57.onrender.com" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  `mongodb+srv://${process.env.USER}:${process.env.DB_PASSWORD}@cluster0.ccyotjk.mongodb.net/`
);

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.create({
      username,
      password: bcrypt.hashSync(password, salt),
    });
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await User.findOne({ username });

    if (!userDoc) {
      return res.status(400).json("User not found");
    }

    const passOk = bcrypt.compareSync(password, userDoc.password);

    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        secret,
        { expiresIn: '1H' },
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json({
            id: userDoc._id,
            username,
          });
        }
      );
    } else {
      res.status(400).json("Invalid login");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/profile", (req, res) => {
  try {
    const { token } = req.cookies;

    jwt.verify(token, secret, {}, (err, info) => {
      if (err) {
        if (err.name === "TokenExpiredError") {
          res.status(401).json({ message: "Token has expired" });
        } else if (err.name === "JsonWebTokenError") {
          res.status(401).json({ message: "Invalid token" });
        } else {
          res.status(500).json({ message: "Internal server error" });
        }
      } else {
        res.json(info);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json("cookie deleted");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title: title,
        summary: summary,
        content: content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.put("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    let newPath = null;
    if (req.file) {
      const { originalname, path } = req.file;
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      newPath = path + "." + ext;
      fs.renameSync(path, newPath);
    }

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) {
        throw err;
      }
      const { id, title, summary, content } = req.body;
      const postDoc = await Post.findById(id);

      const isAuthor =
        JSON.stringify(postDoc.author) === JSON.stringify(info.id);
      if (!isAuthor) {
        return res.status(403).json("Only the author can edit this post");
      }

      await Post.updateOne(
        { _id: id },
        {
          title,
          content,
          summary,
          cover: newPath ? newPath : postDoc.cover,
        }
      );

      const updatedPost = await Post.findById(id);
      res.json(updatedPost);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/post", async (req, res) => {
  try {
    res.json(
      await Post.find()
        .populate("author", ["username"])
        .sort({ createdAt: -1 })
        .limit(20)
    );
  } catch (e) {
    console.log(e);
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

app.get("/user/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const posts = await Post.find({ author: userId }).populate("author", [
      "username",
    ]);
    res.json(posts);
  } catch (e) {
    console.log("Error fetching user posts:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      _id: user._id,
      username: user.username,
    };

    res.json(userData);
  } catch (e) {
    console.log("Error fetching user data:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/user/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log(userId);

    const userPosts = await Post.find({ author: userId });

    res.json(userPosts);
  } catch (e) {
    console.log("Error fetching user posts:", e);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/post/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);

    await Post.findByIdAndDelete(postId);

    res.json({ message: "Post deleted successfully" });
  } catch (e) {
    console.log("Error deleting post:", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.listen(8080);

//     mongodb+srv://daniel:PASSWORD@cluster0.ccyotjk.mongodb.net/
