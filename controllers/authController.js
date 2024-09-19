import bcrypt from "bcrypt";
import passport from "passport";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const signupForm = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("signup", {
    title: "Sign Up",
    auth: false,
    error: req.query.error,
  });
};

const signup = async (req, res, next) => {
  const { email, password } = req.body;

  // Check if the user already exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.redirect("/signup?error=User%20already%20exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    req.logIn(newUser, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  } catch (err) {
    console.error(err);
    res.status(500).render("signup", {
      title: "Sign Up",
      auth: false,
      error: "An error occurred while creating the user.",
    });
  }
};

const loginForm = (req, res) => {
  if (req.isAuthenticated()) return res.redirect("/");
  res.render("login", {
    title: "Login",
    auth: false,
    error: req.query.error,
  });
};

const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.redirect("/login?error=Invalid%20credentials");
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      res.redirect("/");
    });
  })(req, res, next);
};

const logout = (req, res) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy((err) => {
      if (err) return next(err);
      console.log("LOOOGGED OUUUTU");
      res.redirect("/");
    });
  });
};

export default {
  signupForm,
  signup,
  loginForm,
  login,
  logout,
};
