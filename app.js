import express from "express";
import session from "express-session";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "./passportConfig.js"; 
import { PrismaClient } from "@prisma/client";
import path from "path"; 

import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();
const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // prune expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.use(passport.initialize());
app.use(passport.session());

// routes

app.get("/", (req, res) => {
  res.render("test", { title: "Home Page", message: "Hello, EJS!" });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
