const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// Importing client object for database access
const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();

router.get("/", (req, res) => {
  res.send("App is working");
});

router.post("/signup", async (req, res) => {
  // checking if does not already exist in database
  const user = await prisma.user.findUnique({
    where: {
      phone: Number.parseInt(req.body.phone),
    },
  });
  if (user)
    return res.json({
      error: { message: "Phone number is already in use..." },
    });

  // creating user after validating
  const newUser = await prisma.user.create({
    data: {
      name: req.body.name,
      phone: Number.parseInt(req.body.phone),
      password: await bcrypt.hash(
        req.body.password,
        Number.parseInt(process.env.SALT) || 10,
      ),
    },
  });
  console.log(newUser);
  return res.json(newUser);
});

router.post("/login", async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { phone: Number.parseInt(req.body.phone) },
  });
  if (!user)
    return res.json({
      error: { message: "User not found, check phone number..." },
    });
  const valid =await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!valid) return res.json({ error: { message: "Invalid password..." } });

  const payload = {
    id: user.id,
    name: user.name,
    phone: user.phone,
  };
  const token = jwt.sign(payload, process.env.JWT_SECRET,{
    expiresIn: '24h',
  });
  return res.json({ token: token });
});

// routes only used during development
router.delete("/deleledb", async (req, res) => {
  const [db] = await Promise.all([prisma.user.deleteMany()]);
  res.json(db);
});
router.get("/fetchdb", async (req, res) => {
  const [db] = await Promise.all([prisma.user.findMany()]);
  res.json(db);
});
module.exports = router;
