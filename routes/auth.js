import express from "express";
const router = express.Router();
import Users from "../models/User.js";
import CryptoJs from "crypto-js";
import jwt from "jsonwebtoken";

//REGISTER
router.post("/register", async (req, res) => {
  
  const newUser = new Users({
    fullName: req.body.fullName,
    email: req.body.email,
    password: CryptoJs.AES.encrypt(
      req.body.password,
      process.env.PRIVATE_KEY
    ).toString(),
  });

  try {
    const userExists = await Users.findOne({email:req.body.email}) ;
    if (!userExists) {
    const user = await newUser.save();
    res.status(201).json({ Message: `The user has been registered`});
    }
    else {
      res.status(403).json({Message:"There's already a account on this email Id"})
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ Message: `Internal Server error :${err}` });
  }
});






//LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ email: req.body.email });
    if (user) {
      const hashedPassword = CryptoJs.AES.decrypt(
        user.password,
        process.env.PRIVATE_KEY
      );
      const originalPassword = hashedPassword.toString(CryptoJs.enc.Utf8);
      const { password, ...others } = user._doc;
      if (originalPassword !== req.body.password)
        res.status(401).json({ Message: "Incorrect password/credentials" });
      {
        const accessToken = jwt.sign(
          {
            id: user._id,
            isAdmin: user.isAdmin,
          },
          process.env.PRIVATE_KEY,
          {
            expiresIn: "3d",
          }
        );
        res.status(200).send({ ...others, accessToken });
      }
    } else {
      res.status(401).json({ Message: "User not found" });
    }
  } catch (err) {
    res.status(501).json({ Message: `Internal Error: ${err}` });
  }
});





 
router.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

export default { router };
