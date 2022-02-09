import express from 'express' ; 
import dbConnect from './config/db.js' ; 
import testapi from './routes/testapi.js' ;
import auth from './routes/auth.js' ; 
import user from './routes/user.js' ; 
import product from './routes/product.js' ; 
import cart from './routes/cart.js' ; 
import order from "./routes/order.js" ; 
import razor from './routes/razor.js' ; 
import cors from 'cors' ; 


dbConnect() ; 

const corsOptions = {
    origin: [process.env.ALLOWED_CLIENTS.split(',')],
}

const app = express() ; 
app.use(express.json()) ; 
app.use(cors()) ; 
app.get('/', (req,res)=> {
    res.send("<h1>This is the backend server for swagg, welcome</h1>");
})
app.use('/api/testapi', testapi.router) ; 
app.use('/api/auth', auth.router ) ; 
app.use('/api/users', user.router);
app.use('/api/products', product.router);
app.use('/api/orders', order.router);
app.use('/api/cart',cart.router);   
app.use('/api/checkout/',razor.router);








app.listen(process.env.PORT || 7000 , ()=>{
    console.log(`This is running on ${process.env.PORT}`) ; 
})