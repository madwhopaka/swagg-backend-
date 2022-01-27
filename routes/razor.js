import  {Router} from 'express' ; 
import razorpay from 'razorpay' ; 
import request from 'request'  ; 


const razorInstance  = new razorpay({
    key_id  : process.env.razor_id , 
    key_secret : process.env.razor_key, 

})

const router = Router() ; 

router.post("/order",(req,res)=>{
  const amountu = 1000;
  const payment_capture = 0 ; 
    try{
      const options ={
        amount : amountu*100,
        currency : "INR",
        receipt: "receipt#1",
        payment_capture//1
                     };
      razorInstance.orders.create(options,async function(err,order){
        if(err)   return res.status(500).json({message: "Something error!s"});
        else {
           console.log(order) ;
           return res.status(200).json(order) }
      });

    }
    catch(err){
      return res.status(500).json({
        message: "Something error!s"
      })
    }
  });
  

  router.post("/capture/:paymentId",async (req,res)=>{
    try{
      console.log("Hello") ; 
      return request(
        {
          method : "POST",
          url : `https://${process.env.razor_id}:${process.env.razor_key}@api.razorpay.com/v1/payments/${req.params.paymentId}/capture`,
          form:{
            amount : req.body.amount,
            currency: req.body.currency
          },
        },
        async function(err,response,body){
          console.log(err); 
          console.log(response) ; 
          console.log(body) ;
          if(err){
            return res.status(500).json({
              message: "Something error!s"
            })
          }
          return res.status(200).json(body)
        }
      )
    }
    catch(err){
      console.log(err) ; 
      return res.status(500).json({
        message: err.message
      })
    }
  })
  

  export default {router}