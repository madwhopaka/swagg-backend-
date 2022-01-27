import express from "express";
import Cart from "../models/Cart.js";
import {
    verifyToken, 
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";
import CryptoJs from "crypto-js";

const router = express.Router();

// CREATE A Cart  :
router.post("/", verifyTokenAndAuthorization,  async (req, res) => {
  const newCart = Cart(req.body);

  try {
    const savedCart = await newCart.save();
    res.status(200).json(savedCart);
  } catch (err) {
    res.status(500).json(err);
  }
});





//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
  const cart  = await Cart.findById(req.params.id) ; 
  if (cart) {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id ,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedCart);
    } catch (err) {
      res.status(501).json({ Message: "Internal Server Error", error: err });
    }
  } else {
    res.status(403).json({ Message: "Invalid product id" });
  }
});





//DELETE
router.delete("/delete/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (cart) {
      await Cart.findByIdAndDelete(req.params.id);
      res.status(200).json({ Message: "The Product has been deleted" });
    } else {
      res.status(403).json({ Message: "Invalid Product id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, general: " Server Internal Error" });
  }
});



//GET USER CART
router.get("/find/:userId", async (req,res)=> {
        try {
            const cart = await Cart.findOne({userId: req.params.userId}) ;
            if(cart) {
            
                    res.status(200).send(cart) ;
            }
            else {
                res.status(404).json("Product not found") 
            }
        }
        catch(err){
            res.status(500).send(err) ;
        }
})







//GET ALL USER CART ;
router.get("/", verifyTokenAndAdmin , async (req,res)=> {
 try {
        const carts =  await Cart.find() ; 
        res.status(200).json(carts) ; 
 } 
 catch(err) {
        res.status(500).json("Internal Error",err); 
 } 
})



// router.get("/stats", verifyTokenAndAdmin, async (req,res)=> {
//     try {
//         const date = new Date() ;
//         const lastYear  = new Date(date.setFullYear(date.getFullYear()-1)) ;
//         const data = await Products.aggregate([
//             {$match : {createdAt: {$gte: lastYear}}},
//             {$project: {month: {$month: "$createdAt"}}},
//             {$group: { _id: "$month" , total : {$sum:1}}}
//         ])

//         res.status(200).send(data) ;
//     }
//     catch(err){
//         res.status(500).json(`This is the error ${err}`) ;
//     }
// })

export default { router };
