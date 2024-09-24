import prisma from "../prismaClient.js";

const renderHomePage = async (req, res) => {
  if (!req.isAuthenticated()) return res.redirect("/login");

  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
    });

    res.render("home", {
      title: "Home",
      folders,
      auth: req.isAuthenticated(),
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).send("Internal Server Error");
  }
};

const renderAboutPage = (req, res) => {
  res.render("about", {
    title: "About",
    auth: req.isAuthenticated(),
  });
};

export default {
  renderHomePage,
  renderAboutPage,
};
