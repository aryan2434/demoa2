const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const User = require("../models/user");

// GET register page (redirect to home)
router.get("/register", (req, res) => res.redirect("/"));

// GitHub authentication
router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/users/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

// POST register
router.post("/register", async (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password !== password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password && password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    req.flash("error_msg", errors.map((e) => e.msg).join(", "));
    return res.redirect("/");
  } else {
    const user = new User({ name, email, password });

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        req.flash("error_msg", "Email is already registered");
        return res.redirect("/");
      } else {
        await user.save();
        req.flash("success_msg", "You are now registered and can log in");
        return res.redirect("/users/login");
      }
    } catch (err) {
      console.error(err);
      req.flash("error_msg", "An error occurred, please try again");
      return res.redirect("/");
    }
  }
});

// GET login page
router.get("/login", (req, res) => res.render("users/login"));

// POST login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("error_msg", "An error occurred, please try again");
      return res.redirect("/users/login");
    }
    if (!user) {
      req.flash("error_msg", "Invalid email or password");
      return res.redirect("/users/login");
    }
    req.logIn(user, (err) => {
      if (err) {
        req.flash("error_msg", "An error occurred, please try again");
        return res.redirect("/users/login");
      }
      return res.redirect("/expenses");
    });
  })(req, res, next);
});

// GET logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success_msg", "You are logged out");
    res.redirect("/users/login");
  });
});

module.exports = router;
