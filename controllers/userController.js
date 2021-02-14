const mongoose = require("mongoose");
const { validationResult } = require("express-validator");

const User = mongoose.model("User");

exports.loginForm = (req, res) => {
  res.render("login", { title: "Login" });
};
exports.registerForm = (req, res) => {
  res.render("register", { title: "Register" });
};
exports.validateRegister = (req, res, next) => {
  const errors = validationResult(req);
  if (errors && errors.errors.length > 0) {
    console.log("ERR: ", errors);
    req.flash(
      "error",
      errors.errors.map((err) => err.msg)
    );
    res.render("register", {
      title: "Register",
      body: req.body,
      flashes: req.flash(),
    });
    return;
  }
  next();
};

exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  await User.register(user, req.body.password);
  next();
};
