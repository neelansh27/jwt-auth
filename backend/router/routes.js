require("dotenv").config();
const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const verify = require("../middleware/jwtVerify");

// Importing client object for database access
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("App is working");
});

// JWT verification router
router.post("/verify", verify, (req, res) => {
  console.log(req.user);
  res.status(200).json(req.user);
});

router.post("/signup", async (req, res) => {
  // checking if does not already exist in database
  // findUnique doesn't support OR operator
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          phone: req.body.phone,
        },
        {
          email: req.body.email,
        },
      ],
    },
  });
  if (user)
    return res.json({
      error: { message: "Phone no. or Email number is already in use..." },
    });

  // creating user after validating
  const newUser = await prisma.user.create({
    data: {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      password: await bcrypt.hash(
        req.body.password,
        Number.parseInt(process.env.SALT) || 10,
      ),
    },
  });
  return res.json(newUser);
});

router.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { phone: req.body.phone },
  });
  if (!user)
    return res.json({
      error: { message: "User not found, check phone number..." },
    });
  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.json({ error: { message: "Invalid password..." } });
  const payload = {
    id: user.id,
    name: user.name,
    phone: user.phone,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return res.json({ token: token });
});

// // routes only used during development
// router.delete("/deleledb", async (req, res) => {
//   const [db] = await Promise.all([prisma.user.deleteMany()]);
//   res.json(db);
// });
router.get("/fetchdb", async (req, res) => {
  const [db, tk] = await Promise.all([
    prisma.user.findMany(),
    prisma.rtokens.findMany(),
  ]);
  res.json({ db, tk });
});

router.post("/reset_pass", async (req, res) => {
  // Generating a unique token
  const rtoken = crypto.randomBytes(16).toString("hex");
  const hashedtoken = await bcrypt.hash(
    rtoken,
    Number.parseInt(process.env.SALT) || 10,
  );

  // checking if user with given email exists
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
  });
  if (!user)
    return res
      .status(422)
      .json({ error: { message: "Check email, user not fount" } });
// Removing old tokens
  await prisma.rtokens.deleteMany({
    where: {
      userId: user.id,
    },
  });
  await prisma.rtokens.create({
    data: {
      token: hashedtoken,
      userId: user.id,
    },
  });

  const link = `${process.env.FRONT_URL}/auth/reset_pass?id=${user.id}&token=${rtoken}`;

  // sending mail using nodemailer
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EPASS,
    },
  });
  transporter.sendMail({
    from: process.env.EMAIL,
    to: req.body.email,
    subject: "Link to reset password",
    text: "Open this link in browser to reset your password: " + link,
  });
  return res.json({ resetLink: link });
});

router.post("/reset_verify", async (req, res) => {
  const token = req.body.token;
  const id = req.body.id;
  // Checking if request is valid
  const entry = await prisma.rtokens.findFirst({
    where: {
      userId: Number.parseInt(id),
    },
  });
  if (!entry)
    return res.status(422).json({ error: { message: "Invalid request id" } });
  console.log("exists");
  const valid = await bcrypt.compare(token, entry.token);
  if (!valid)
    return res.status(422).json({ error: { message: "Invalid request id" } });
  console.log("Asdconsole.log");
  // updating user password
  const user = await prisma.user.update({
    where: {
      id: entry.userId,
    },
    data: {
      password: await bcrypt.hash(
        req.body.password,
        Number.parseInt(process.env.SALT) || 10,
      ),
    },
  });
  await prisma.rtokens.deleteMany({
    where: {
      id: user.id,
    },
  });
  return res.json(user);
});
module.exports = router;
