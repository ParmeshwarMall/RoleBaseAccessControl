const express = require("express");
const cors = require("cors");
const port = 8000;
const mongoose = require("mongoose");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
require("dotenv").config();
app.use(
  cors({
    origin: "http://localhost:5173",
    // origin:"https://role-access.netlify.app",
    credentials: true,
  })
);

const mongoUrl = process.env.MONGO_URL;
const secretKey = process.env.SECRET_KEY;

main()
  .then(() => {
    console.log("Connection success");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(mongoUrl);
}

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  username: String,
  password: String,
  role: String,
});

const User = mongoose.model("users2", userSchema);

const verifyToken = async (req, res, next) => {
  const token = await req.cookies.token;

  if (!token) {
    return res.status(403).send("Token is required");
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).send("Invalid password");
    }
    const token = jwt.sign(
      { username },
      secretKey,
      { expiresIn: "1h" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    res.json({
      message: "Logged in successfully",
      role: user.role,
    });
  } catch (err) {
    res.status(500).send("Error logging in");
  }
});

app.post("/register", async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const userExist = await User.findOne({ username });
    if (userExist) {
      res
        .status(409)
        .send({ message: "Username already exist. Use another username" });
    } else {
      const hashPass = await bcrypt.hash(password, 12);
      const newUser = new User({
        name,
        username,
        email,
        password: hashPass,
        role,
      });
      await newUser.save();
      res.status(201).send({ message: "User added successfully!" });
    }
  } catch {
    console.error(e);
    res
      .status(500)
      .send({ message: "Error in registration. Please try again." });
  }
});

app.get("/allusers", verifyToken,async (req, res) => {
  try {
    const users = await User.find();
    const user=await User.findOne({username:req.user.username});
    res.status(200).json({ users,user });
  } catch (e) {
    console.error(e);
    res.status(500).send({ message: "Error in fetching details." });
  }
});

app.delete("/deleteuser/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: "Error deleting user." });
  }
});

app.put("/updateuser/:id", async (req, res) => {
  const { role } = req.body;
  try {
    await User.findByIdAndUpdate(req.params.id, { role });
    res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error updating user" });
  }
});

app.post("/forgotpassword",async(req,res)=>{
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "An error occurred. Please try again later." });
  }

})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
