function isAuthenticated(req) {
  return req.isAuthenticated();
}

const home = (req, res) => {
  res.render("home", {
    title: "Home",
    auth: isAuthenticated(req),
  });
};

export default {
  home,
};
