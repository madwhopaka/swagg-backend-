import jwt from 'jsonwebtoken' ; 






export const verifyToken = (req,res,next)=>  {
    const authHeader = req.headers.token  ; 
    if(authHeader)  {
        const token = authHeader.split(" ")[1] ; 
        jwt.verify(token, process.env.PRIVATE_KEY, (err,user)=> {
                if(err) res.status(403).send("Token is invalid") ; 
                else {
                req.user = user ; 
                next() ;
                } 
        })
    } 
    else {
         return res.status(401).send("You are not Authenticated")
    }
}




const verifyTokenAndAuthorization = (req,res,next)=> {
    // console.log(`This is the body :  ${req.body}`   ) ; 
   
    verifyToken(req,res,()=> {     
        if (req.user.id===req.params.id || req.user.isAdmin) next() 
        else res.status(403).send("You are not allowed to do that") 
    })
}


const verifyTokenAndAdmin = (req,res,next)=> {
    verifyToken(req,res,()=> {     

        if ( req.user.isAdmin) next() ;
        else {
            res.status(403).send("You are not allowed to do that") ;
        }
    })
}




export  {verifyTokenAndAuthorization, verifyTokenAndAdmin}  ;