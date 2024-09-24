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
      auth: true,
    });
  } catch (error) {
    console.error("Error fetching folders:", error);
    res.status(500).send("Internal Server Error");
  }
};

const renderAboutPage = async (req, res) => {
  // folders here for testing purposes
  const folders = await prisma.folder.findMany({
    where: { userId: req.user.id },
  });
  res.render("about", {
    title: "About",
    auth: req.isAuthenticated(),
    folders,
  });
};

const renderFolderPage = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }

  const folderId = parseInt(req.params.id, 10);

  try {
    const folder = await prisma.folder.findUnique({
      where: { id: folderId },
      include: { files: true },
    });

    if (!folder || folder.userId !== req.user.id) {
      return res.status(403).send("Access denied to this folder.");
    }

    res.render("folder", {
      title: folder.name,
      folder,
      files: folder.files,
      auth: true,
    });
  } catch (error) {
    console.error("Error fetching folder and files:", error);
    res.status(500).send("Internal Server Error");
  }
};

export default {
  renderHomePage,
  renderAboutPage,
  renderFolderPage,
};
