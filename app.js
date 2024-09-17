import express from "express";
import session from "express-session";
import expressLayouts from "express-ejs-layouts";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import passport from "./passportConfig.js";
import { PrismaClient } from "@prisma/client";
import path from "path";

import authRouter from "./routes/authRoutes.js";
import pageRouter from "./routes/pageRoutes.js";

import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    saveUninitialized: true,
    store: new PrismaSessionStore(prisma, {
      checkPeriod: 2 * 60 * 1000, // prune expired sessions every 2 minutes
      dbRecordIdIsSessionId: true,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
  })
);

app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize());
app.use(passport.session());

app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use("/", pageRouter);
app.use("/", authRouter);

let PORT = process.env.PORT | 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
