import express from "express";
import Order from "../models/Order.js";
import {
    verifyToken, 
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} from "./verifyToken.js";
import CryptoJs from "crypto-js";

const router = express.Router();

// CREATE A Cart  :
router.post("/", verifyToken,  async (req, res) => {
  const newOrder = Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});





//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  
  const order = await Order.findById(req.params.id) ; 
  if (order) {
    try {
      const updatedOrder = await Order.findByIdAndUpdate(
        req.params.id ,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).send(updatedOrder);
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
    const order = await Order.findById(req.params.id);
    if (order) {
      await Order.findByIdAndDelete(req.params.id);
      res.status(200).json({ Message: "The Product has been deleted" });
    } else {
      res.status(403).json({ Message: "Invalid Product id" });
    }
  } catch (err) {
    res.status(500).json({ error: err, general: " Server Internal Error" });
  }
});



//GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization,  async (req,res)=> {
        try {
            const orders = await Order.find({userId: req.params.userId}) ;
            if(orders) {
            
                    res.status(200).send(orders) ;
            }
            else {
                res.status(404).json("Order not found") 
            }
        }
        catch(err){
            res.status(500).send(err) ;
        }
})



//GET ALL USER ORDERS;

router.get("/", verifyTokenAndAdmin , async (req,res)=> {
 try {
        const orders =  await Order.find() ; 
        res.status(200).json(orders) ; 
 } 
 catch(err) {
        res.status(500).json("Internal Error",err); 
 } 
})


//GET MONTHLY INCOME : - 


router.get('/stats', verifyTokenAndAdmin, async (req,res)=> {
    const date = new Date() ; 
    const lastMonth = new Date(date.setMonth(date.getMonth())) ; 
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth()-1)); 

    try {
        const income = await Order.aggregate([
            {$match: { createdAt: {$gte:previousMonth }}},
            {$project: { month : {$month : "$createdAt"}, 
                          sales: "$amount"}},
            {$group: {_id: "$month", total: {$sum: "$sales"}}}
        ]);
        console.log(income) ; 
          res.status(200).json(income) ; 
    } 

    catch(err) {
        res.status(500).json(err) ; 
    }

})



export default { router };
