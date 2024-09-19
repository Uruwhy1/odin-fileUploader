import e from "express";

function isAuthenticated(req) {
  return req.isAuthenticated();
}

const home = (req, res) => {
  if (!isAuthenticated(req)) res.redirect("/login");
  else
    res.render("home", {
      title: "Home",
      auth: isAuthenticated(req),
    });
};

export default {
  home,
};
