const home = (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else
    res.render("home", {
      title: "Home",
      auth: true,
    });
};

export default {
  home,
};
