const renderHomePage = (req, res) => {
  if (!req.isAuthenticated()) res.redirect("/login");
  else
    res.render("home", {
      title: "Home",
    });
};

const renderAboutPage = (req, res) => {
  res.render("about", {
    title: "About",
  });
};

export default {
  renderHomePage,
  renderAboutPage,
};
