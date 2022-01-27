import express from 'express' ; 
import Users from '../models/User.js';
import {verifyTokenAndAuthorization,verifyTokenAndAdmin} from './verifyToken.js' ; 
import CryptoJs from 'crypto-js' ; 

const router = express.Router() ; 


//UPDATE
 
router.put('/:id', verifyTokenAndAuthorization ,async (req,res)=> {
    if (req.body.password) req.body.password = CryptoJs.AES.encrypt(req.body.password, process.env.PRIVATE_KEY).toString() ; 
    try  {
                const updatedUser = await Users.findByIdAndUpdate(req.params.id,{
                    $set: req.body 
                }, {new:true})
                res.status(200).send(updatedUser) ;  
    }
    catch(err) {
       
        res.status(501).json({"Message": "Internal Server Error", "error": err}) ; 
    }
} )


//DELETE 

router.delete("/delete/:id", verifyTokenAndAuthorization, async (req,res)=> {
    try {
           const user =  await Users.findById(req.params.id) ; 
           if (user) {
               await Users.findByIdAndDelete(req.params.id)  ;
               res.status(200).json({Message:"The user has been deleted"})  ;
           }
           else {
               res.status(403 ).json({Message:"Invalid user id"}); 
           }
            
    }
    catch(err) {
        res.status(500).json({"error": err, "general": " Server Internal Error"})
    }
})


//GET USER 

router.get("/find/:id", verifyTokenAndAdmin, async (req,res)=> {
        try {
            const user = await Users.findById(req.params.id) ; 
            if(user) {
                    const {password, ...others} = user._doc ;

                    res.status(200).send(others) ; 
            }
        }
        catch(err){
            res.status(500).send(err) ; 
        }
})

//GET ALL USERS 
router.get("/", verifyTokenAndAdmin, async (req,res)=> {
    
    try {
        const query  = req.query ;
        const users = query? await Users.find().sort({_id:-1}).limit(5): await Users.find() ; 
        if(users) 
               { 
                const  {email,...other}  = users
                console.log(other) ; 
                res.status(200).send(other) ; 
               }
        else {
            res.status(500).json("Internal Server Error")
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
        const data = await Users.aggregate([
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


export default {router}