import mongoose from 'mongoose' ; 
import dotenv from 'dotenv' ; 


dotenv.config() ; 

export default  function dbConnect () {

 mongoose.connect(process.env.MONGO_BASE_URL).then(()=> {console.log("successful")}).catch((error)=>{console.log(error)});
 
 const connection = mongoose.connection; 
 console.log(connection.readyState) ;
 connection.once('open', ()=> {
     console.log("This is done")
 })

}