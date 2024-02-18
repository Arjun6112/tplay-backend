import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { Queries } from "../database/queries.js";

dotenv.config({
  path: path.join(process.cwd(), ".env"),
});

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (JWT_SECRET_KEY === undefined) {
  throw new Error("JWT_SECRET NOT FOUND");
}

export async function registerNewUser(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(404).send("Fill all required fields");
    return;
  }

  const { email, password } = req.body;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const existingUser = await Queries.doesEmailAlreadyExists(email);
  if (existingUser) {
    res.status(409).send("Email Already Exists");
    return;
  }

  const registeredUser = await Queries.addNewUserToDB(
    email,
    hashedPassword
  );

  if (registeredUser === null) {
    res.status(500).send("Adding user to DB was unsuccessful!");
    return;
  }

  const payload = {
    userId: registeredUser.id,
    email: email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY);

  res.status(201).json({
    token: token,
  });
}

export async function login(req, res) {
  if (!req.body.email || !req.body.password) {
    res.status(404).send("Fill all required fields");
    return;
  }

  const { email, password } = req.body;
  const hashedPassword = crypto
    .createHash("sha256")
    .update(password)
    .digest("hex");

  const existingUser = await Queries.findUserWithEmail(email);
  if (!existingUser) {
    res.status(404).send("User does not exists");
    return;
  }

  if (existingUser.password !== hashedPassword) {
    res.status(404).send("email or passowrd is incorrect");
    return;
  }

  const payload = {
    userId: existingUser.id,
    email: existingUser.email,
  };

  const token = jwt.sign(payload, JWT_SECRET_KEY);

  res.status(201).json({
    token: token,
  });
}
