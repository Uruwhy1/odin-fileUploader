import prisma from "../prismaClient.js";

const setUserInLocals = async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user.id },
      });

      if (user) {
        res.locals.username = user.name;
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  }
  next();
};

export default setUserInLocals;
