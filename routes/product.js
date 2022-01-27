import express from "express";
import Products from "../models/Product.js";
import {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";
import CryptoJs from "crypto-js";

const router = express.Router();

// CREATE A PRODUCT  :
router.post("/", verifyTokenAndAdmin , async (req, res) => {
  const newProduct = Products(req.body);

  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});





//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  // const product = await Products.findOne({id: req.params.id});
  const product = await Products.findById(req.params.id) ; 
  if (product) {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(
        product._id, 
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedProduct);
    } catch (err) {
      res.status(501).json({ Message: "Internal Server Error", error: err });
    }
  } else {
    res.status(403).json({ Message: "Invalid product id" });
  }
});





//DELETE
router.delete("/delete/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Products.findById(req.params.id);
    if (products) {
      await Products.findByIdAndDelete(req.params.id);
      res.status(200).json({ Message: "The Product has been deleted" });
    } else {
      res.status(403).json({ Message: "Invalid Product id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, general: " Server Internal Error" });
  }
});



//GET PRODUCT
router.get("/find/:id", async (req,res)=> {
        try {
            const product = await Products.findById(req.params.id) ;
            if(product) {
            
                    res.status(200).send(product) ;
            }
            else {
                res.status(404).json("Product not found") 
            }
        }
        catch(err){
            res.status(500).send(err) ;
        }
})






//GET ALL PRODUCTS
router.get("/", async (req,res)=> {


  const qNew  = req.query.new ;
  const qCategories= req.query.category ; 
    try {
      let products  ; 
        if (qNew) {
          console.log("pa")

        products  = await Products.find().sort({createdAt:-1}) ; 
        }
        else if (qCategories) {
          console.log("wa")
         products = await Products.find({categories: {
           $in : [qCategories]
         }}) ; 
        }
        else {
          products = await Products.find() ; 
        }
  
        if(products)
               {
               
               
                res.status(200).json(products) ;
               }
        else {
            res.status(404).json("No Products found") ; 
        }
    }
    catch(err){
        res.status(500).send({err}) ;
    }
})

router.get("/stats", verifyTokenAndAdmin, async (req,res)=> {
    try {
        const date = new Date() ;
        const lastYear  = new Date(date.setFullYear(date.getFullYear()-1)) ;
        const data = await Products.aggregate([
            {$match : {createdAt: {$gte: lastYear}}},
            {$project: {month: {$month: "$createdAt"}}},
            {$group: { _id: "$month" , total : {$sum:1}}}
        ])

        res.status(200).send(data) ;
    }
    catch(err){
        res.status(500).json(`This is the error ${err}`) ;
    }
})

export default { router };
