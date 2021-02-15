const passport = require("passport");

exports.login = passport.authenticate("local", {
  failureRedirect: "/login",
  failureFlash: "Failed Login!",
  successRedirect: "/",
  successFlash: "You are now logged in!",
});

exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You are logged out!");
  res.redirect("/");
};

exports.isLoggedIn = (req, res, next) => {
  // first check if user is authenticated
  if (req.isAuthenticated()) {
    next(); // they're logged in
    return;
  }
  req.flash("error", "You must be loggedin");
  res.redirect("/login");
};
